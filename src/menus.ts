import { InlineKeyboard } from 'grammy'
import { EDetectionModes } from './types'

export const groupConfigKeyboard = new InlineKeyboard()
  .text(`💣 Видалення`, EDetectionModes.DELETION)
  .text(`⚠️ Попередження`, EDetectionModes.WARNING)
  .text(`📊 Статистика`, EDetectionModes.INFO)