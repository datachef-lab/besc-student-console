// 'use client'

// import * as React from "react"

// import { ToastAction } from "@/components/ui/toast"
// import {
//   Toast, {
//     ToastProps
//   }
// } from "@/components/ui/toast"
// import {
//   Toaster
// } from "@/components/ui/toaster"
// import { useToast } from "@/components/ui/use-toast"

// const TOAST_LIMIT = 1

// const TOAST_REMOVE_DELAY = 1000000

// type State = {
//   toasts: ToastProps[]
// }

// enum ActionType {
//   ADD_TOAST,
//   UPDATE_TOAST,
//   DISMISS_TOAST,
//   REMOVE_TOAST,
// }

// type Action =
//   | { type: ActionType.ADD_TOAST; toast: ToastProps }
//   | { type: ActionType.UPDATE_TOAST; toast: Partial<ToastProps> }
//   | { type: ActionType.DISMISS_TOAST; toastId?: string }
//   | { type: ActionType.REMOVE_TOAST; toastId?: string }

// let count = 0

// function genId() {
//   count = count + 1
//   return count.toString()
// }

// const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

// const addToRemoveQueue = (toastId: string) => {
//   if (toastTimeouts.has(toastId)) {
//     return
//   }

//   const timeout = setTimeout(() => {
//     toastTimeouts.delete(toastId)
//     dispatch({
//       type: ActionType.REMOVE_TOAST,
//       toastId: toastId
//     })
//   }, TOAST_REMOVE_DELAY)

//   toastTimeouts.set(toastId, timeout)
// }

// export const reducer = (state: State, action: Action): State => {
//   switch (action.type) {
//     case ActionType.ADD_TOAST:
//       return {
//         ...state,
//         toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
//       }

//     case ActionType.UPDATE_TOAST:
//       return {
//         ...state,
//         toasts: state.toasts.map((t) =>
//           t.id === action.toast.id ? {
//             ...t,
//             ...action.toast
//           } : t
//         ),
//       }

//     case ActionType.DISMISS_TOAST:
//     {
//       const {
//         toastId
//       } = action

//       // Depending on whether last toast is present or not, clean all toasts or clean specific toast
//       if (toastId) {
//         addToRemoveQueue(toastId)
//         return {
//           ...state,
//           toasts: state.toasts.map((t) =>
//             t.id === toastId ? {
//               ...t,
//               open: false
//             } : t
//           ),
//         }
//       } else {
//         state.toasts.forEach((t) => {
//           addToRemoveQueue(t.id)
//         })

//         return {
//           ...state,
//           toasts: state.toasts.map((t) => ({
//             ...t,
//             open: false
//           })),
//         }
//       }

//     }

//     case ActionType.REMOVE_TOAST:
//       if (action.toastId === undefined) return state
//       return {
//         ...state,
//         toasts: state.toasts.filter((t) => t.id !== action.toastId),
//       }
//     default:
//       return state
//   }
// }

// const ToastContext = React.createContext<{
//   state: State;
//   dispatch: React.Dispatch<Action>
// } | undefined>(undefined)

// export function ToasterProvider({
//   children
// }: {
//   children: React.ReactNode
// }) {
//   const [state, dispatch] = React.useReducer(reducer, {
//     toasts: []
//   })

//   return (
//     <ToastContext.Provider value={{ state, dispatch }}>
//       {children}
//     </ToastContext.Provider>
//   )
// }

// export function useToast() {
//   const context = React.useContext(ToastContext)

//   if (context === undefined) {
//     throw new Error('useToast must be used within a ToasterProvider')
//   }

//   return context
// }

// function Toasts() {
//   const { toasts } = useToast()

//   return (
//     <Toaster>
//       {toasts.map(({ id, title, description, action, ...props }) => {
//         return (
//           <Toast key={id} {...props}>
//             <div className="grid gap-1">
//               {title && <ToastTitle>{title}</ToastTitle>}
//               {description && (
//                 <ToastDescription>{description}</ToastDescription>
//               )}
//             </div>
//             {action}
//           </Toast>
//         )
//       })}
//     </Toaster>
//   )
// }

// export { Toasts } 