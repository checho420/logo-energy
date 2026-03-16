import React, { createContext, useContext, useState, useEffect } from 'react';
import ordersData from '../data/orders.json';
import customersData from '../data/customers.json';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Initial Load
    useEffect(() => {
        const initData = () => {
            setLoading(true);
            try {
                const savedOrders = localStorage.getItem('logo_energy_orders_v2');
                const savedCustomers = localStorage.getItem('logo_energy_customers_v2');

                if (savedOrders) {
                    setOrders(JSON.parse(savedOrders));
                } else {
                    setOrders(ordersData);
                    localStorage.setItem('logo_energy_orders_v2', JSON.stringify(ordersData));
                }

                if (savedCustomers) {
                    setCustomers(JSON.parse(savedCustomers));
                } else {
                    setCustomers(customersData);
                    localStorage.setItem('logo_energy_customers_v2', JSON.stringify(customersData));
                }
            } catch (error) {
                console.error("Error initializing admin data:", error);
                setOrders(ordersData);
                setCustomers(customersData);
            } finally {
                setLoading(false);
            }
        };
        initData();
    }, []);

    // Persistence Effects
    useEffect(() => {
        if (!loading) localStorage.setItem('logo_energy_orders_v2', JSON.stringify(orders));
    }, [orders, loading]);

    useEffect(() => {
        if (!loading) localStorage.setItem('logo_energy_customers_v2', JSON.stringify(customers));
    }, [customers, loading]);

    // Derived Metrics
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.status !== 'cancelado' ? order.total : 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'pendiente').length;
    const deliveredOrders = orders.filter(o => o.status === 'entregado').length;
    const canceledOrders = orders.filter(o => o.status === 'cancelado').length;

    // Recent Orders
    const recentOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

    // Top Selling products logic would typically require product aggregation from order items, 
    // but since our mock data structure is simple, we might just use the "sold" field in ProductContext for that. 
    // Here we focus on order metrics.

    const addOrder = (newOrder) => {
        const orderWithId = {
            ...newOrder,
            id: `ORD-${(orders.length + 1).toString().padStart(3, '0')}`,
            date: new Date().toISOString().split('T')[0],
            status: 'pendiente'
        };
        setOrders(prev => [orderWithId, ...prev]);
        return orderWithId;
    };

    const updateOrderStatus = (orderId, newStatus) => {
        setOrders(prev => prev.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        ));
    };

    return (
        <AdminContext.Provider value={{
            orders,
            customers,
            loading,
            addOrder,
            updateOrderStatus,
            metrics: {
                totalOrders,
                totalRevenue,
                pendingOrders,
                deliveredOrders,
                canceledOrders
            },
            recentOrders
        }}>
            {children}
        </AdminContext.Provider>
    );
};

