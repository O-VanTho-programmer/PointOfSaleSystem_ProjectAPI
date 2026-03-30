import { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { useQueryClient } from '@tanstack/react-query';
import { orderKeys } from './useOrders';
import { itemKeys } from './useItems';
import { tableKeys } from './useTables';

export const usePosSignalR = () => {
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const queryClient = useQueryClient();

    useEffect(() => {
        const baseUrl = (process.env.NEXT_PUBLIC_SERVER_URL || '').replace(/\/api$/, '');

        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${baseUrl}/hubs/pos`, {
                withCredentials: true
            })
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);

        return () => {
            newConnection.stop();
        };
    }, []);

    useEffect(() => {
        if (!connection) return;

        const handleOrderUpdate = () => {
            console.log('New update detected! Refreshing cache...');
            queryClient.invalidateQueries({ queryKey: orderKeys.all });
            queryClient.invalidateQueries({ queryKey: itemKeys.all });
            queryClient.invalidateQueries({ queryKey: tableKeys.all });
        };

        connection.on('OrderListUpdated', handleOrderUpdate);
        connection.on('PaymentReceived', (orderId: number) => {
            queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
        });

        if (connection.state === signalR.HubConnectionState.Disconnected) {
            connection.start()
                .then(() => {
                    console.log('Connected to POS SignalR Hub!');
                })
                .catch(e => console.log('SignalR Connection Error: ', e));
        }

        return () => {
            connection.off('OrderListUpdated', handleOrderUpdate);
            connection.off('PaymentReceived');
        };
    }, [connection, queryClient]);

    return connection;
};