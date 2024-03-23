import { useCallback, useEffect, useRef, useState } from 'react'

export default function useChatLiveModeScrolling<T extends HTMLElement>(
  messages: string
) {
  const [isLiveModeEnabled, setIsLiveModeEnabled] = useState(true)
  const chatMessagesBoxRef = useRef<T | null>(null)

  const scrollNewMessages = useCallback(() => {
    chatMessagesBoxRef.current?.lastElementChild?.scrollIntoView()
  }, [])

  const toggleLiveModeOnChatScroll = useCallback(() => {
    if (chatMessagesBoxRef.current) {
      const { scrollHeight, scrollTop, clientHeight } = chatMessagesBoxRef.current;
      const isNearBottom = scrollHeight - scrollTop <= clientHeight + 150; // 150px buffer

      setIsLiveModeEnabled(isNearBottom);
    }
  }, []);

  useEffect(() => {
    const ref = chatMessagesBoxRef.current
    ref?.addEventListener('scroll', toggleLiveModeOnChatScroll)
    return () =>
      ref?.removeEventListener('scroll', toggleLiveModeOnChatScroll)
  }, [toggleLiveModeOnChatScroll])

  useEffect(() => {
    if (isLiveModeEnabled) {
      scrollNewMessages();
    }
  }, [messages, isLiveModeEnabled, scrollNewMessages]);

  return {
    chatMessagesBoxRef,
    isLiveModeEnabled,
    scrollNewMessages,
  }
}