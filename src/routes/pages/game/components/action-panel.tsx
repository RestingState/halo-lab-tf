import { useNavigate, useParams } from 'react-router-dom'
import socket from '~/api/socket'
import ConfirmToast from '~/components/confirm-toast'
import { SERVER_ERROR } from '~/constants'
import useUser from '~/hooks/useUser'
import { Direction } from '~/type'
import { toast } from 'react-toastify'
import upArrowSrc from '~/assets/svg/up_arrow.svg'
import rightArrowSrc from '~/assets/svg/right_arrow.svg'
import downArrowSrc from '~/assets/svg/down_arrow.svg'
import leftArrowSrc from '~/assets/svg/left_arrow.svg'
import { ComponentPropsWithoutRef } from 'react'

type ActionPanelProps =
  | {
      yourTurn: boolean
      allowedDirections: ('up' | 'right' | 'down' | 'left')[]
      onMove: (direction: Direction) => void
      gameFinished: false
    }
  | { gameFinished: true }

function ActionPanel(props: ActionPanelProps) {
  const { user } = useUser()
  const { gameId } = useParams()
  const navigate = useNavigate()

  const handleGiveUp = () => {
    const confirm = () => {
      socket.emit(
        'giveUp',
        {
          userId: user.user!.id,
          gameId: +(gameId as string),
        },
        () => toast.error(SERVER_ERROR)
      )
    }

    toast(
      <ConfirmToast title="You really want to give up?" confirm={confirm} />,
      {
        autoClose: false,
        position: 'bottom-center',
      }
    )
  }

  const handleExit = () => navigate('/')

  return (
    <div className="relative">
      <div className="flex justify-center">
        {props.gameFinished ? (
          <button className="btn btn-blue">Watch replay</button>
        ) : (
          <div className="grid grid-cols-[repeat(3,max-content)] gap-2">
            <div />
            <MovementButton
              src={upArrowSrc}
              disabled={
                !props.yourTurn || !props.allowedDirections.includes('up')
              }
              onClick={() => props.onMove('up')}
            />
            <div />
            <MovementButton
              src={leftArrowSrc}
              disabled={
                !props.yourTurn || !props.allowedDirections.includes('left')
              }
              onClick={() => props.onMove('left')}
            />
            <MovementButton
              src={downArrowSrc}
              disabled={
                !props.yourTurn || !props.allowedDirections.includes('down')
              }
              onClick={() => props.onMove('down')}
            />
            <MovementButton
              src={rightArrowSrc}
              disabled={
                !props.yourTurn || !props.allowedDirections.includes('right')
              }
              onClick={() => props.onMove('right')}
            />
          </div>
        )}
      </div>
      <div className="absolute bottom-0 right-0 flex gap-5">
        <button
          className="btn btn-red"
          disabled={props.gameFinished}
          onClick={handleGiveUp}
        >
          Give up
        </button>
        <button
          className="btn btn-red"
          disabled={!props.gameFinished}
          onClick={handleExit}
        >
          Exit
        </button>
      </div>
    </div>
  )
}

export default ActionPanel

type MovementButtonProps = {
  src: string
  className?: string
  disabled: boolean
} & ComponentPropsWithoutRef<'button'>

const MovementButton = ({
  src,
  className,
  disabled,
  ...rest
}: MovementButtonProps) => {
  return (
    <button
      className={`btn btn-blue ${className}`}
      disabled={disabled}
      {...rest}
    >
      <img className="h-6 w-6" src={src} />
    </button>
  )
}
