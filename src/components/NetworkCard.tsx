import React, { useState } from 'react'
import { Wifi, Copy, Edit, Trash2, MapPin, StickyNote, QrCode, Eye, EyeOff, Calendar } from 'lucide-react'
import { WifiNetwork } from '../hooks/useWifiNetworks'
import toast from 'react-hot-toast'
import QRCode from 'qrcode'

interface NetworkCardProps {
  network: WifiNetwork
  onEdit: (network: WifiNetwork) => void
  onDelete: (id: string) => void
}

export const NetworkCard: React.FC<NetworkCardProps> = ({ network, onEdit, onDelete }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [qrCode, setQrCode] = useState<string>('')

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(`${label} copied to clipboard!`)
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const generateQRCode = async () => {
    try {
      const wifiString = `WIFI:T:WPA;S:${network.network_name};P:${network.password};;`
      const qr = await QRCode.toDataURL(wifiString, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      setQrCode(qr)
      setShowQR(true)
    } catch (error) {
      toast.error('Failed to generate QR code')
    }
  }

  return (
    <>
      <div className="group relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10">
        {/* Gradient border effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-emerald-500/0 to-purple-500/0 group-hover:from-blue-500/20 group-hover:via-emerald-500/20 group-hover:to-purple-500/20 rounded-2xl transition-all duration-300 -z-10 blur-xl"></div>
        
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative p-3 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl">
                <Wifi className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors duration-200">
                {network.network_name}
              </h3>
              {network.location && (
                <div className="flex items-center space-x-1 text-sm text-gray-400">
                  <MapPin className="w-3 h-3" />
                  <span>{network.location}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => onEdit(network)}
              className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-200"
              aria-label="Edit network"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(network.id)}
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
              aria-label="Delete network"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <span className="text-sm font-medium text-gray-300">Password:</span>
                <span className="font-mono text-sm text-white truncate">
                  {showPassword ? network.password : '•'.repeat(Math.min(network.password.length, 12))}
                </span>
              </div>
              <div className="flex space-x-2 ml-2">
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 text-gray-400 hover:text-gray-300 hover:bg-white/10 rounded-lg transition-all duration-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => copyToClipboard(network.password, 'Password')}
                  className="p-1.5 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all duration-200"
                  aria-label="Copy password"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {network.notes && (
            <div className="flex items-start space-x-2 text-sm bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
              <StickyNote className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <span className="text-gray-300">{network.notes}</span>
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t border-white/10">
            <div className="flex items-center space-x-1 text-xs text-gray-400">
              <Calendar className="w-3 h-3" />
              <span>Added {new Date(network.created_at).toLocaleDateString()}</span>
            </div>
            <button
              onClick={generateQRCode}
              className="flex items-center space-x-1 text-sm text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 px-3 py-1.5 rounded-lg transition-all duration-200"
            >
              <QrCode className="w-4 h-4" />
              <span>QR Code</span>
            </button>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-8 max-w-sm w-full border border-white/20">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-6">
                QR Code for {network.network_name}
              </h3>
              {qrCode && (
                <div className="bg-white p-4 rounded-xl mb-6 inline-block">
                  <img src={qrCode} alt="WiFi QR Code" className="mx-auto rounded-lg" />
                </div>
              )}
              <p className="text-sm text-gray-300 mb-6">
                Scan this QR code to connect to the network
              </p>
              <button
                onClick={() => setShowQR(false)}
                className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}