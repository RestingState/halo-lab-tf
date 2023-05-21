import { ToastContentProps } from 'react-toastify'

type ConfirmToastProps = { confirm: () => void } & Partial<ToastContentProps>

export default function ConfirmToast({
  confirm,
  closeToast,
}: ConfirmToastProps) {
  return (
    <div>
      <h2 className="text-center text-lg font-bold text-black">
        You really want to give up?
      </h2>
      <div className="pt-4" />
      <div className="flex justify-between px-8">
        <button className="btn btn-red text-sm" onClick={confirm}>
          Confirm
        </button>
        <button className="btn btn-blue-outline text-sm" onClick={closeToast}>
          Cancel
        </button>
      </div>
    </div>
  )
}
