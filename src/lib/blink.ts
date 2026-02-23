import { createClient } from '@blinkdotnew/sdk'

export const blink = createClient({
  projectId: import.meta.env.VITE_BLINK_PROJECT_ID || 'admin-dashboard-app-o3nqai8g',
  publishableKey: import.meta.env.VITE_BLINK_PUBLISHABLE_KEY || 'blnk_pk_b01f0b3f',
  auth: { 
    mode: 'managed',
    roles: {
      admin: { permissions: ['*'] },
      editor: { permissions: ['data.create', 'data.update'], inherit: ['viewer'] },
      viewer: { permissions: ['data.read'] }
    }
  },
})
