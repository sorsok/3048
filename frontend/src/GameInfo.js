import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { scaleLinear, scaleBand } from 'd3-scale'
import XYAxis from './XYAxis'
import Line from './Line'
import { line, curveMonotoneX } from 'd3-shape'
import { extent } from 'd3-array'
import { transition } from 'd3-transition'
import styles from './GameInfo.scss'

import * as d3 from 'd3'

const COLOURS = [
  '#0d9d2d',
  '#1b9329',
  '#288824',
  '#367d20',
  '#43731b',
  '#516817',
  '#5e5e12',
  '#6c530e',
  '#794809',
  '#873e05',
]

const GameInfo = ({ score, moveCount, automatedMoveCount, moveHistory }) => {
  const lastMove = moveHistory[moveHistory.length - 1]
  let changeInScore = 0
  if (moveHistory.length > 1) {
    changeInScore = lastMove.score - moveHistory[moveHistory.length - 2].score
  }
  const percentChangeInScore = (changeInScore * 100) / lastMove.score || 0
  let colourIndex = 5 - percentChangeInScore
  if (colourIndex < 0) colourIndex = 0
  if (colourIndex > 9) colourIndex = 9
  colourIndex = Math.round(colourIndex, 0)
  const color = COLOURS[colourIndex]

  const parentWidth = 500
  const margins = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20,
  }

  const width = parentWidth - margins.left - margins.right
  const height = 200 - margins.top - margins.bottom

  const xScale = scaleBand()
    .domain(moveHistory.map((move, idx) => idx))
    .rangeRound([0, width])
    .padding(0.1)

  const yScale = scaleLinear()
    .domain(extent(moveHistory, move => move.score))
    .range([height, 0])
    .nice()

  const lineGenerator = line()
    .x(d => xScale(d.name))
    .y(d => yScale(d.value))
    .curve(curveMonotoneX)

  return (
    <div className={styles.container}>
      <div className={styles.infoBox}>{`Game Score: ${score}`}</div>
      <div className={styles.infoBox}>{`Moves: ${moveCount}`}</div>
      <div className={styles.infoBox}>{`Moves Played For You: ${automatedMoveCount}`}</div>
      <div className={styles.infoBox}>{`AI Score: ${Math.round(lastMove.score, 2)}`}</div>
      <svg
        className="lineChartSvg"
        width={width + margins.left + margins.right}
        height={height + margins.top + margins.bottom}
      >
        <g transform={`translate(${margins.left}, ${margins.top})`}>
          <XYAxis {...{ xScale, yScale, height }} />
          <Line
            data={moveHistory.slice(moveHistory.length - 100, moveHistory.length).map((d, idx) => ({
              name: idx,
              value: d.score,
            }))}
            xScale={xScale}
            yScale={yScale}
            lineGenerator={lineGenerator}
            width={width}
            height={height}
          />
        </g>
      </svg>
    </div>
  )
}

export default GameInfo

GameInfo.propTypes = {
  score: PropTypes.number.isRequired,
  moveCount: PropTypes.number.isRequired,
  automatedMoveCount: PropTypes.number.isRequired,
  moveHistory: PropTypes.arrayOf(PropTypes.shape({ score: PropTypes.number.isRequired })),
}

GameInfo.defaultProps = {}
