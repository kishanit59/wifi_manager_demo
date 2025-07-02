import React, { useState } from 'react'
import { Plus, Search, Wifi, LogOut, User, Zap, Shield, Globe } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useWifiNetworks, WifiNetwork } from '../hooks/useWifiNetworks'
import { NetworkCard } from './NetworkCard'
import { NetworkForm } from './NetworkForm'

export const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth()
  const { networks, loading, addNetwork, updateNetwork, deleteNetwork } = useWifiNetworks(user?.id)
  const [showForm, setShowForm] = useState(false)
  const [editingNetwork, setEditingNetwork] = useState<WifiNetwork | undefined>()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredNetworks = networks.filter(network =>
    network.network_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    network.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    network.notes?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleFormSubmit = (data: Omit<WifiNetwork, 'id' | 'created_at' | 'updated_at'>) => {
    if (editingNetwork) {
      updateNetwork(editingNetwork.id, data)
    } else {
      addNetwork(data)
    }
  }

  const handleEdit = (network: WifiNetwork) => {
    setEditingNetwork(network)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this network?')) {
      deleteNetwork(id)
    }
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingNetwork(undefined)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Animated geometric shapes */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-3000"></div>
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white/5 backdrop-blur-2xl border-b border-white/10 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl blur-lg opacity-75"></div>
                  <div className="relative p-3 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl">
                    <Wifi className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    WiFi Manager
                  </h1>
                  <p className="text-sm text-gray-400 flex items-center space-x-2">
                    <Shield className="w-3 h-3" />
                    <span>{networks.length} network{networks.length !== 1 ? 's' : ''} secured</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-xl rounded-full px-4 py-2 border border-white/10">
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900"></div>
                  </div>
                  <span className="text-sm text-gray-300 hidden sm:block max-w-32 truncate">
                    {user?.email}
                  </span>
                </div>
                <button
                  onClick={signOut}
                  className="p-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 border border-transparent hover:border-red-500/20"
                  aria-label="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <Wifi className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{networks.length}</p>
                  <p className="text-gray-400 text-sm">Total Networks</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-emerald-500/20 rounded-xl">
                  <Shield className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">100%</p>
                  <p className="text-gray-400 text-sm">Encrypted</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Zap className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {networks.filter(n => n.created_at > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()).length}
                  </p>
                  <p className="text-gray-400 text-sm">This Week</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Add */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search networks, locations, or notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400 transition-all duration-200"
              />
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-blue-500/25"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <div className="relative flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Add Network</span>
              </div>
            </button>
          </div>

          {/* Networks Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-500/20 rounded-full"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          ) : filteredNetworks.length === 0 ? (
            <div className="text-center py-20">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-full blur-3xl"></div>
                <div className="relative w-24 h-24 bg-white/5 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto border border-white/10">
                  <Wifi className="w-12 h-12 text-gray-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {searchTerm ? 'No networks found' : 'Welcome to WiFi Manager'}
              </h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                {searchTerm 
                  ? 'Try adjusting your search terms or add a new network' 
                  : 'Start building your secure WiFi network collection. Add your first network to get started.'
                }
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Add Your First Network
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNetworks.map((network) => (
                <NetworkCard
                  key={network.id}
                  network={network}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Form Modal */}
      {showForm && (
        <NetworkForm
          network={editingNetwork}
          onSubmit={handleFormSubmit}
          onClose={closeForm}
        />
      )}
    </div>
  )
}