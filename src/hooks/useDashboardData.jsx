import { useState, useEffect } from 'react';
import { blink } from '../lib/blink';
import { useBlinkAuth } from '@blinkdotnew/react';

export function useDashboardData() {
  const { user, isAuthenticated } = useBlinkAuth();
  const [data, setData] = useState({
    organization: null,
    team: [],
    contacts: [],
    invoices: [],
    transactions: [],
    leads: [],
    deals: [],
    loading: true,
    error: null
  });

  const seedData = async () => {
    if (!user?.id) return;
    
    try {
      // Seed Team
      const teamCount = await blink.db.teams.count();
      if (teamCount === 0) {
        await blink.db.teams.createMany([
          { id: 'team_1', userId: user.id, name: "Jon Snow", email: "jonsnow@gmail.com", age: 35, phone: "(665)121-5454", access: "admin" },
          { id: 'team_2', userId: user.id, name: "Cersei Lannister", email: "cerseilannister@gmail.com", age: 42, phone: "(421)314-2288", access: "manager" },
          { id: 'team_3', userId: user.id, name: "Jaime Lannister", email: "jaimelannister@gmail.com", age: 45, phone: "(422)982-6739", access: "manager" },
          { id: 'team_4', userId: user.id, name: "Anya Stark", email: "anyastark@gmail.com", age: 16, phone: "(921)425-6742", access: "user" },
          { id: 'team_5', userId: user.id, name: "Daenerys Targaryen", email: "daenerystargaryen@gmail.com", age: 31, phone: "(421)445-1189", access: "user" },
        ]);
      }

      // Seed Contacts
      const contactCount = await blink.db.contacts.count();
      if (contactCount === 0) {
        await blink.db.contacts.createMany([
          { id: 'contact_1', userId: user.id, name: "Jon Snow", email: "jonsnow@gmail.com", age: 35, phone: "(665)121-5454", address: "0987 Wall St", city: "New York", zipCode: "10001", registrarId: "123512" },
          { id: 'contact_2', userId: user.id, name: "Cersei Lannister", email: "cerseilannister@gmail.com", age: 42, phone: "(421)314-2288", address: "1234 Main St", city: "Paris", zipCode: "75001", registrarId: "123512" },
          { id: 'contact_3', userId: user.id, name: "Jaime Lannister", email: "jaimelannister@gmail.com", age: 45, phone: "(422)982-6739", address: "4422 High St", city: "London", zipCode: "SW1A", registrarId: "123512" },
        ]);
      }

      // Seed Invoices
      const invoiceCount = await blink.db.invoices.count();
      if (invoiceCount === 0) {
        await blink.db.invoices.createMany([
          { id: 'inv_1', userId: user.id, name: "Jon Snow", email: "jonsnow@gmail.com", cost: 21.24, phone: "(665)121-5454", date: "03/12/2022" },
          { id: 'inv_2', userId: user.id, name: "Cersei Lannister", email: "cerseilannister@gmail.com", cost: 12.50, phone: "(421)314-2288", date: "04/15/2022" },
        ]);
      }

      // Seed Transactions
      const txCount = await blink.db.transactions.count();
      if (txCount === 0) {
        await blink.db.transactions.createMany([
          { id: 'tx_1', userId: user.id, txId: "01e4dsa", userName: "Jon Snow", date: "2021-09-01", cost: 43.95 },
          { id: 'tx_2', userId: user.id, txId: "0315dsa", userName: "Cersei Lannister", date: "2022-04-01", cost: 133.45 },
          { id: 'tx_3', userId: user.id, txId: "01e4dsa", userName: "Jaime Lannister", date: "2022-09-01", cost: 43.95 },
        ]);
      }

      // Seed FAQs
      const faqCount = await blink.db.faqs.count();
      if (faqCount === 0) {
        await blink.db.faqs.createMany([
          { id: 'faq_1', userId: user.id, question: 'An Important Question', answer: 'This is an answer to an important question.' },
          { id: 'faq_2', userId: user.id, question: 'Another Important Question', answer: 'This is another answer to an important question.' },
          { id: 'faq_3', userId: user.id, question: 'Your Favorite Question', answer: 'This is an answer to your favorite question.' },
          { id: 'faq_4', userId: user.id, question: 'Some Random Question', answer: 'This is an answer to some random question.' },
          { id: 'faq_5', userId: user.id, question: 'The Final Question', answer: 'This is an answer to the final question.' },
        ]);
      }
    } catch (err) {
      console.error('Seeding failed:', err);
    }
  };

  const fetchData = async () => {
    if (!isAuthenticated || !user?.id) return;
    
    setData(prev => ({ ...prev, loading: true }));
    try {
      await seedData();
      
      const userRec = await blink.db.users.get(user.id);
      const organizationId = userRec?.organizationId;

      const [org, team, contacts, invoices, transactions, leads, deals] = await Promise.all([
        organizationId ? blink.db.organizations.get(organizationId) : null,
        blink.db.teams.list(),
        blink.db.contacts.list(),
        blink.db.invoices.list(),
        blink.db.transactions.list(),
        organizationId ? blink.db.leads.list({ where: { organizationId } }) : [],
        organizationId ? blink.db.deals.list({ where: { organizationId } }) : []
      ]);

      setData({
        organization: org,
        team,
        contacts,
        invoices,
        transactions,
        leads,
        deals,
        loading: false,
        error: null
      });
    } catch (err) {
      setData(prev => ({ ...prev, loading: false, error: err.message }));
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAuthenticated, user?.id]);

  return { ...data, refresh: fetchData };
}
