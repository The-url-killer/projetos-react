import { useCallback, useEffect, useState } from 'react'
import { maleCharacter } from './ui/resources/index'

import './app.scss'

const MAP_SIZE = 20
const MAP_HEIGHT = 17
const MAP_LIMIT = -1
const USER_POSITION = {
  startLine: 5,
  startHeight: 6,
}
const KEY_EVENT = 'keyup'
const MAP_TYPES = {
  USER: 'user',
  EMPTY: 'empty',
}
const USER_MOVENT = {
  LEFT: 'ArrowLeft',
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
  RIGHT: 'ArrowRight',
}

const App = () => {
  const [worldMap, setWorldMap] = useState([])
  const [userPosition, setUserPosition] = useState({})
  const isMapEmpty = !worldMap?.length

  const renderMap = () => {
    if (!isMapEmpty) {
      return (
        <main className="t-world">
          {worldMap.map((column, columnIndex) =>
            column.map((space, spaceIndex) => (
              <div
                className="t-world__space"
                key={`${columnIndex}-${spaceIndex}`}
              >
                {space.type === MAP_TYPES.USER && (
                  <img
                    src={maleCharacter}
                    alt="your character"
                    className="t-world__user"
                  />
                )}
              </div>
            ))
          )}
        </main>
      )
    }
  }

  useEffect(() => {
    if (isMapEmpty) {
      let newMap = []
      const { startLine, startHeight } = USER_POSITION

      for (let column = 0; column < MAP_HEIGHT; column++) {
        newMap[column] = []
        for (let line = 0; line < MAP_SIZE; line++) {
          const isUserStartPostion =
            column === startHeight && line === startLine

          if (isUserStartPostion) {
            setUserPosition({ column, line })
          }

          newMap[column][line] = {
            type: isUserStartPostion ? MAP_TYPES.USER : MAP_TYPES.EMPTY,
          }
        }
      }

      setWorldMap(newMap)
    }
  }, [isMapEmpty, userPosition])

  const keyMoventEvent = useCallback(
    ({ key }) => {
      let line = userPosition.line
      let column = userPosition.column
      let canMove = false

      console.log(key)
      switch (key) {
        case USER_MOVENT.DOWN:
          column += 1

          if (column !== MAP_HEIGHT) {
            canMove = true
          }
          break
        case USER_MOVENT.UP:
          column -= 1

          if (column !== MAP_LIMIT) {
            canMove = true
          }
          break
        case USER_MOVENT.LEFT:
          line -= 1

          if (line !== MAP_LIMIT) {
            canMove = true
          }
          break
        case USER_MOVENT.RIGHT:
          line += 1

          if (line !== MAP_SIZE) {
            canMove = true
          }
          break
        default:
          break
      }

      if (canMove) {
        setWorldMap((worldMap) => {
          const newWorldMap = [...worldMap]

          newWorldMap[column][line] = { type: MAP_TYPES.USER }
          newWorldMap[userPosition.column][userPosition.line] = {
            type: MAP_TYPES.EMPTY,
          }

          return newWorldMap
        })

        console.log(line, column)

        setUserPosition({ line, column })
      }
    },

    [userPosition]
  )

  useEffect(() => {
    window.addEventListener(KEY_EVENT, keyMoventEvent)

    return () => {
      window.removeEventListener(KEY_EVENT, keyMoventEvent)
    }
  }, [keyMoventEvent])

  return renderMap()
}

export { App }
