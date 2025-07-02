import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { encryptPassword, decryptPassword } from '../lib/encryption'
import toast from 'react-hot-toast'

export interface WifiNetwork {
  id: string
  network_name: string
  password: string
  location?: string
  notes?: string
  created_at: string
  updated_at: string
}

export const useWifiNetworks = (userId: string | undefined) => {
  const [networks, setNetworks] = useState<WifiNetwork[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNetworks = async () => {
    if (!userId) return

    try {
      const { data, error } = await supabase
        .from('wifi_networks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      const decryptedNetworks = data.map(network => ({
        ...network,
        password: decryptPassword(network.encrypted_password)
      }))

      setNetworks(decryptedNetworks)
    } catch (error) {
      toast.error('Failed to fetch networks')
      console.error('Error fetching networks:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNetworks()
  }, [userId])

  const addNetwork = async (networkData: Omit<WifiNetwork, 'id' | 'created_at' | 'updated_at'>) => {
    if (!userId) return

    try {
      const { data, error } = await supabase
        .from('wifi_networks')
        .insert({
          user_id: userId,
          network_name: networkData.network_name,
          encrypted_password: encryptPassword(networkData.password),
          location: networkData.location || null,
          notes: networkData.notes || null
        })
        .select()
        .single()

      if (error) throw error

      const newNetwork = {
        ...data,
        password: networkData.password
      }

      setNetworks(prev => [newNetwork, ...prev])
      toast.success('Network added successfully!')
    } catch (error) {
      toast.error('Failed to add network')
      console.error('Error adding network:', error)
    }
  }

  const updateNetwork = async (id: string, networkData: Partial<Omit<WifiNetwork, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      const updateData: any = {
        ...networkData,
        updated_at: new Date().toISOString()
      }

      if (networkData.password) {
        updateData.encrypted_password = encryptPassword(networkData.password)
        delete updateData.password
      }

      const { data, error } = await supabase
        .from('wifi_networks')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      const updatedNetwork = {
        ...data,
        password: networkData.password || networks.find(n => n.id === id)?.password || ''
      }

      setNetworks(prev => prev.map(network => 
        network.id === id ? updatedNetwork : network
      ))
      toast.success('Network updated successfully!')
    } catch (error) {
      toast.error('Failed to update network')
      console.error('Error updating network:', error)
    }
  }

  const deleteNetwork = async (id: string) => {
    try {
      const { error } = await supabase
        .from('wifi_networks')
        .delete()
        .eq('id', id)

      if (error) throw error

      setNetworks(prev => prev.filter(network => network.id !== id))
      toast.success('Network deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete network')
      console.error('Error deleting network:', error)
    }
  }

  return {
    networks,
    loading,
    addNetwork,
    updateNetwork,
    deleteNetwork,
    refetch: fetchNetworks
  }
}