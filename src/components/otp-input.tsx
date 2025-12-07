import { useRef, useState, useEffect, KeyboardEvent, ClipboardEvent } from 'react'

interface OtpInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  className?: string
}

export function OtpInput({ length = 6, value, onChange, className = '' }: OtpInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    const otpArray = value.split('').slice(0, length)
    const paddedArray = [...otpArray, ...Array(length - otpArray.length).fill('')]
    setOtp(paddedArray)
  }, [value, length])

  const handleChange = (index: number, val: string) => {
    const numericValue = val.replace(/\D/g, '')
    
    if (numericValue.length === 0) {
      const newOtp = [...otp]
      newOtp[index] = ''
      setOtp(newOtp)
      onChange(newOtp.join(''))
      return
    }

    if (numericValue.length === 1) {
      const newOtp = [...otp]
      newOtp[index] = numericValue
      setOtp(newOtp)
      onChange(newOtp.join(''))

      if (index < length - 1) {
        inputRefs.current[index + 1]?.focus()
      }
    } else if (numericValue.length > 1) {
      handlePaste(numericValue, index)
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '') {
        if (index > 0) {
          inputRefs.current[index - 1]?.focus()
        }
      } else {
        const newOtp = [...otp]
        newOtp[index] = ''
        setOtp(newOtp)
        onChange(newOtp.join(''))
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (pastedData: string, startIndex: number = 0) => {
    const numericData = pastedData.replace(/\D/g, '').slice(0, length)
    const newOtp = [...otp]

    for (let i = 0; i < numericData.length && startIndex + i < length; i++) {
      newOtp[startIndex + i] = numericData[i]
    }

    setOtp(newOtp)
    onChange(newOtp.join(''))

    const nextIndex = Math.min(startIndex + numericData.length, length - 1)
    inputRefs.current[nextIndex]?.focus()
  }

  const handlePasteEvent = (e: ClipboardEvent<HTMLInputElement>, index: number) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text')
    handlePaste(pastedData, index)
  }

  const handleFocus = (index: number) => {
    inputRefs.current[index]?.select()
  }

  return (
    <div className={`flex gap-3 justify-center ${className}`}>
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={(e) => handlePasteEvent(e, index)}
          onFocus={() => handleFocus(index)}
          className="w-12 h-12 text-center text-2xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
        />
      ))}
    </div>
  )
}
