import React, { useState, useRef, useEffect } from 'react'
import Config from '@/config/index.js'
import { useNetwork } from '@/components/NetwrokProvider'

const NetworkSelect = ({ onChange }) => {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(Config.networkList[0])
  const ref = useRef(null)
  const { setGlobalNetwork, globalNetwork } = useNetwork()

  useEffect(() => {
    function handleClickOutside (event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    setSelected(globalNetwork)
  }, [globalNetwork])

  const handleSelect = (item) => {
    setSelected(item)
    setOpen(false)
    onChange && onChange(item)
  }

  return (
    <div className="relative min-w-[148px] max-w-[200px] w-auto" ref={ref}>
      <button
        type="button"
        className="min-w-[148px] max-w-[200px] w-auto h-[36px] bg-[#FFD100] rounded-full pl-2 pr-3 flex items-center font-bold text-black"
        onClick={() => setOpen((o) => !o)}
      >
        <img src={selected.icon} alt={selected.name} className="w-6 h-6 mr-2 rounded-full bg-[#D9D9D9]" />
        <span className="flex-1 whitespace-nowrap">{selected.name}</span>
        <svg className="w-4 h-4 ml-auto" fill="none" stroke="black" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <ul className="absolute z-10 mt-1 min-w-[148px] max-w-[200px] w-auto bg-[#1A1C22] border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {Config.networkList.map((item) => (
            <li
              key={item.name}
              className={`flex items-center px-4 py-2 cursor-pointer hover:bg-[#22252E] ${selected.name === item.name ? 'bg-[#22252E]' : ''}`}
              onClick={() => handleSelect(item)}
            >
              <img src={item.icon} alt={item.name} className="w-5 h-5 mr-2 rounded-full" />
              <span className="whitespace-nowrap">{item.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default NetworkSelect
