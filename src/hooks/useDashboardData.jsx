import { useState, useEffect } from 'react';
import { blink } from '../lib/blink';
import { useBlinkAuth } from '@blinkdotnew/react';
import { mockDataTeam, mockDataContacts, mockDataInvoices, mockTransactions } from '../data/mockData';

export function useDashboardData() {
  const { user, isAuthenticated } = useBlinkAuth();
  const [data, setData] = useState({
    team: [],
    contacts: [],
    invoices: [],
    transactions: [],
    loading: true,
    error: null
  });

  const seedData = async () => {
    if (!user?.id) return;
    
    try {
      // Seed Team
      const teamCount = await blink.db.teams.count();
      if (teamCount === 0) {
        await blink.db.teams.createMany(mockDataTeam.map(item => ({
          ...item,
          id: `team_${item.id}`,
          userId: user.id
        })));
      }

      // Seed Contacts
      const contactCount = await blink.db.contacts.count();
      if (contactCount === 0) {
        await blink.db.contacts.createMany(mockDataContacts.map(item => ({
          ...item,
          id: `contact_${item.id}`,
          userId: user.id,
          zipCode: item.zipCode,
          registrarId: item.registrarId.toString()
        })));
      }

      // Seed Invoices
      const invoiceCount = await blink.db.invoices.count();
      if (invoiceCount === 0) {
        await blink.db.invoices.createMany(mockDataInvoices.map(item => ({
          ...item,
          id: `inv_${item.id}`,
          userId: user.id,
          cost: parseFloat(item.cost)
        })));
      }

      // Seed Transactions
      const txCount = await blink.db.transactions.count();
      if (txCount === 0) {
        await blink.db.transactions.createMany(mockTransactions.map((item, idx) => ({
          id: `tx_${idx}`,
          userId: user.id,
          txId: item.txId,
          userName: item.user,
          date: item.date,
          cost: parseFloat(item.cost)
        })));
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
      
      const [team, contacts, invoices, transactions] = await Promise.all([
        blink.db.teams.list(),
        blink.db.contacts.list(),
        blink.db.invoices.list(),
        blink.db.transactions.list()
      ]);

      setData({
        team,
        contacts,
        invoices,
        transactions,
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
