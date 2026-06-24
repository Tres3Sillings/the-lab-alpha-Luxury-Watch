import React from 'react'

export default function CalculatorMock() {
  return (
    <div className="calc-mock">
      <div className="calc-header">
        <span>MATH INTERPOLATOR</span>
      </div>
      <div className="calc-body">
        <div className="calc-line">
          <span className="calc-label">spreadsheet.sum(A1:A10)</span>
          <span className="calc-val">NaN</span>
        </div>
        <div className="calc-line">
          <span className="calc-label">pixelsWidth * Math.sin(theta)</span>
          <span className="calc-val">1080.45px</span>
        </div>
        <div className="calc-divider"></div>
        <div className="calc-formula">
          <code>
            {`const math = {\n  excel: "spreadsheet fatigue",\n  javascript: "unlimited power"\n};\nconsole.log(math.javascript);`}
          </code>
        </div>
        <div className="calc-note">
          "Thankfully JS does the math now."
        </div>
      </div>
    </div>
  )
}
