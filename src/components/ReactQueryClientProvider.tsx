"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { PropsWithChildren, createContext, useState, useContext } from 'react';


const ModalContext = createContext<{
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}>({
  isModalOpen: false,
  setIsModalOpen: () => { },
});

const queryClient = new QueryClient();

export function ReactQueryClientProvider({ children }: PropsWithChildren) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <ModalContext.Provider value={{ isModalOpen, setIsModalOpen }}>
        {children}
      </ModalContext.Provider>
    </QueryClientProvider>
  );
}


export const useModal = () => useContext(ModalContext);