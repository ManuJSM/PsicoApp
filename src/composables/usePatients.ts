import { ref } from 'vue'
import { type Patient, type CreatePatient, ToastType } from '@/types/types'
import { fetchMePatients } from '@/api/SleepData/me.api'
import {
  createUser,
  deleteUser,
  updatePacient,
} from '@/api/notifications/user.api'
import { useToast } from '@/composables/useToast'

// Estado global compartido (como tu useToast)
const patients = ref<Patient[]>([])
const loading = ref(false)

export function usePatients() {
  const { setToast } = useToast()

  const loadPatients = async () => {
    if (patients.value.length > 0) return // Evita recargas innecesarias
    loading.value = true
    try {
      patients.value = (await fetchMePatients()) || []
    } finally {
      loading.value = false
    }
  }

  const handleAdd = async (patient: CreatePatient) => {
    loading.value = true
    try {
      const created = await createUser({ user: patient })
      patients.value.push(created)
      setToast(ToastType.SUCCESS, 'Paciente añadido')
      return true
    } catch (e) {
      if (e instanceof Error) setToast(ToastType.ERROR, e.message)
      else setToast(ToastType.ERROR, 'Error al añadir')
      return false
    } finally {
      loading.value = false
    }
  }

  const handleSave = async (patient: Patient) => {
    loading.value = true
    try {
      await updatePacient(patient)
      const index = patients.value.findIndex(p => p.id === patient.id)
      if (index !== -1) patients.value[index] = { ...patient }
      setToast(ToastType.SUCCESS, 'Paciente actualizado')
      return true
    } catch (e) {
      if (e instanceof Error) setToast(ToastType.ERROR, e.message)
      else setToast(ToastType.ERROR, 'Error al actualizar')
      return false
    } finally {
      loading.value = false
    }
  }

  const handleDelete = async (id: number) => {
    loading.value = true
    try {
      await deleteUser({ id })
      patients.value = patients.value.filter(p => p.id !== id)
      setToast(ToastType.SUCCESS, 'Paciente eliminado')
      return true
    } catch (e) {
      if (e instanceof Error) setToast(ToastType.ERROR, e.message)
      else setToast(ToastType.ERROR, 'Error al eliminar')
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    patients,
    loading,
    loadPatients,
    handleAdd,
    handleSave,
    handleDelete,
  }
}
