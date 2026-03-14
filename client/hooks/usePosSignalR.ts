import { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { useQueryClient } from '@tanstack/react-query';
import { orderKeys } from './useOrders'; 

export const usePosSignalR = () => {
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const queryClient = useQueryClient();

    useEffect(() => {
        // NEXT_PUBLIC_SERVER_URL usually contains "/api", but SignalR is hosted at the root level 
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
        if (connection) {
            connection.start()
                .then(() => {
                    console.log('Connected to POS SignalR Hub!');

                    connection.on('OrderListUpdated', () => {
                        console.log('New order detected! Refreshing cache...');
                        
                        queryClient.invalidateQueries({ queryKey: orderKeys.all });
                    });
                })
                .catch(e => console.log('SignalR Connection Error: ', e));
        }
    }, [connection, queryClient]);

    return connection;
};