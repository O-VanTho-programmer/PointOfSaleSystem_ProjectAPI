import { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { useQueryClient } from '@tanstack/react-query';
import { orderKeys } from './useOrders';

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
            console.log('New order detected! Refreshing cache...');
            queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
        };

        connection.on('OrderListUpdated', handleOrderUpdate);

        if (connection.state === signalR.HubConnectionState.Disconnected) {
            connection.start()
                .then(() => {
                    console.log('Connected to POS SignalR Hub!');
                })
                .catch(e => console.log('SignalR Connection Error: ', e));
        }

        return () => {
            connection.off('OrderListUpdated', handleOrderUpdate);
        };
    }, [connection, queryClient]);

    return connection;
};