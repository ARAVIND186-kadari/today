import React, { useEffect } from 'react';
import Head from 'next/head';
import '../styles/globals.css';
import { useAuthStore } from '../store/authStore';

export default function App({ Component, pageProps }) {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <>
      <Head>
        <title>Agentflow_AI - Multi-Agent Automation Platform</title>
        <meta name="description" content="AI Operations Automation Platform with Multi-Agent Orchestration" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
