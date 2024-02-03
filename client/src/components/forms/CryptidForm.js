import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, FormGroup, Label } from 'reactstrap'
import { createCryptid, getCryptidById, updateCryptid } from '../../managers/cryptidManager'

export const CryptidForm = ({ loggedInUser }) => {
  const [imageUrlInput, setImageUrlInput] = useState('')
  const [descInput, setDescInput] = useState('')
  const [formCompleted, setFormCompleted] = useState(false)
  const [cryptid, setCryptid] = useState({})
  const { cryptidId } = useParams()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    if (formCompleted) {
      const [newImageUrl, newDesc] = [imageUrlInput.trim(), descInput.trim()]

      if (cryptidId === 'new') {
        //TODO!: creating a new cryptid PROPOSAL
        /*
        // creating a new cryptid proposal
        createCryptid({
          name: //!,
          description: newDesc,
          image: newImageUrl,
          status: "pending",
        }).then((newCryptid) => {
          //!
        })
        */
      } else {
        // editing an existing cryptid
        updateCryptid({
          name: cryptid.name,
          description: newDesc,
          image: newImageUrl,
          status: cryptid.status,
          id: cryptid.id,
        }).then((updatedCryptid) => {
          navigate(`/cryptids/details/${updatedCryptid.id}`)
        })
      }
    }
  }

  useEffect(() => {
    if (!isNaN(parseInt(cryptidId))) {
      getCryptidById(parseInt(cryptidId)).then(setCryptid)
    }
  }, [cryptidId])

  useEffect(() => {
    if (!loggedInUser.isAdmin) {
      navigate('/cryptids')
    }
  }, [loggedInUser, navigate])

  useEffect(() => {
    if (!!descInput.trim()) {
      //TODO: check for valid url
      setFormCompleted(true)
    } else {
      setFormCompleted(false)
    }
  }, [descInput])

  useEffect(() => {
    if (cryptidId === 'new') {
      // creating a new cryptid
      setDescInput('')
      setImageUrlInput('')
    } else {
      // editing an existing cryptid
      getCryptidById(parseInt(cryptidId)).then((cryptid) => {
        if (!!cryptid) {
          const { image, description } = cryptid
          setImageUrlInput(image)
          setDescInput(description)
        } else {
          // url is invalid
          navigate('/cryptids/edit/new')
        }
      })
    }
  }, [cryptidId, navigate])

  return (
    <ul>
      {cryptid && (
        <>
          <li className='cryptid-details__cryptid'>{cryptid.name}</li>
          <img className='cryptid-details__img' src={cryptid.image} alt={'provided url is invalid'} />
        </>
      )}
      <form className='cryptid-form'>
        <FormGroup id='cryptid-form__image-url'>
          <Label for='cryptid-form__image-url-input'></Label>
          <input
            id='cryptid-form__image-url-input'
            className='cryptid-form__image-url-input'
            placeholder='Image URL (optional)'
            value={imageUrlInput}
            onChange={(e) => {
              setImageUrlInput(e.target.value)
            }}
          />
        </FormGroup>
        <FormGroup id='cryptid-form__description'>
          <Label for='cryptid-form__description-input'></Label>
          <textarea
            id='cryptid-form__description-input'
            onChange={(e) => {
              setDescInput(e.target.value)
            }}
            placeholder='Description...'
            value={descInput}
            required
          />
        </FormGroup>
        {formCompleted ? (
          <Button color='primary' onClick={handleSubmit}>
            Save
          </Button>
        ) : (
          <Button color='primary' onClick={handleSubmit} disabled>
            Save
          </Button>
        )}
      </form>
    </ul>
  )
}
