import React from 'react'

export default function Candidate(
  name: string,
  imagePath: string,
  voteTotal: number,
  reversed = false,
) {
  return reversed ? (
    <div className="candidate-container">
      <div className="candidate-image-container">
        <img 
          src={imagePath}
          className='candidate-image'
        />
      </div>
      <div className="candidate-text-container-reversed">
        <p className="candidate-name">{name}</p>
        <p className="candidate-vote-total">{voteTotal}</p>
      </div>
    </div>
  ) : (
    <div className="candidate-container">
      <div className="candidate-text-container">
        <p className="candidate-name">{name}</p>
        <p className="candidate-vote-total">{voteTotal}</p>
      </div>
      <div className="candidate-image-container">
        <img 
          src={imagePath}
          className='candidate-image'
        />
      </div>
    </div>
  )
}
