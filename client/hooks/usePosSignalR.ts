import { useEffect, useRef, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { useQueryClient } from '@tanstack/react-query';
import { orderKeys } from './useOrders';
import { itemKeys } from './useItems';
import { tableKeys } from './useTables';

export interface UnderPaidPayload {
    orderId: number;
    amountPaid: number;
    expectedAmount: number;
}

export const usePosSignalR = (onUnderPaid?: (payload: UnderPaidPayload) => void) => {
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const queryClient = useQueryClient();
    
    const onUnderPaidRef = useRef(onUnderPaid);
    useEffect(() => {
        onUnderPaidRef.current = onUnderPaid;
    });

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

        const handleUnderPaid = (orderId: number, amountPaid: number, expectedAmount: number) => {
            console.log('[SignalR] PaymentUnderPaid:', orderId, amountPaid, expectedAmount);
            // Call through the ref — always points to the latest callback, never stale
            onUnderPaidRef.current?.({ orderId, amountPaid, expectedAmount });
        };

        connection.on('OrderListUpdated', handleOrderUpdate);
        connection.on('PaymentReceived', (orderId: number) => {
            queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
        });
        connection.on('PaymentUnderPaid', handleUnderPaid);

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
            connection.off('PaymentUnderPaid', handleUnderPaid);
        };
    }, [connection, queryClient]);

    return connection;
};