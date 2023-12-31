'use client'
import { useState, useEffect } from 'react';
import { useAlert } from '@/app/components/UseAlert';


export default function Home() {

  const [twitterUsername, setTwitterUsername] = useState<string>('');
  const [twitterUsernameError, setTwitterUsernameError] = useState<string>('');

  const [walletAddress, setWalletAddress] = useState<string>('');

  const [gifIdea, setGifIdea] = useState<string>('');
  const [gifIdeaError, setGifIdeaError] = useState<string>('');

  const [penguinID, setPenguinID] = useState<string>('');
  const [penguinIDError, setPenguinIDError] = useState<string>('');

  const { showMessage } = useAlert();


  const handleSubmit = async () => {
    let hasError = false;

    // Validation
    if (!twitterUsername.trim()) {
      setTwitterUsernameError('Twitter username is required.');
      hasError = true;
    } else {
      setTwitterUsernameError('');
    }

    if (!gifIdea.trim()) {
      setGifIdeaError('GIF idea is required.');
      hasError = true;
    } else {
      setGifIdeaError('');
    }

    if (!penguinID.trim()) {
      setPenguinIDError('Penguin # is required.');
      hasError = true;
    } else {
      setPenguinIDError('');
    }

    if (!hasError) {
      try {
        const response = await fetch('/api/submitGif', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            twitterUsername,
            walletAddress,
            gifIdea,
            penguinID,
          }),
        });

        if (response.ok) {
          showMessage('Your idea was successfully submitted!');
          // Reset form data
          setTwitterUsername('');
          setWalletAddress(walletAddress);
          setGifIdea('');
          setPenguinID('');
        } else {
          showMessage('Something went wrong, please try again later!');
        }
      } catch (error) {
        showMessage('Error while submitting your idea, please try again later!');
      }
    }
  }

  useEffect(() => {
    const savedAddress = localStorage.getItem("walletAddress");
    if (savedAddress) {
      setWalletAddress(savedAddress);
    }
  }, []);


  return (
    <div className='mx-4 md:mx-10 lg:mx-72'>
      <h1 className='text-3xl md:text-4xl lg:text-5xl mt-10 mb-10'>
        Submit Your Gif
      </h1>
      <p className='text-sm md:text-base'>
        The Pengu Nation is taking over the GIF scene,
        and we need your help to build out a community-driven GIF collection radiating good vibes.
        Complete this short form for a chance to have your penguin featured in a GIF and sticker on our <a href=''>Giphy page</a>!
        Join the discussions in our <a href=''>Discord</a> and follow the <a href=''>Twitter page</a> which posts new uploads.
      </p>
      <div className='mt-5'>
        <h3 className='text-2xl md:text-3xl lg:text-4xl'>Twitter Username</h3>
        <input
          className='form-input w-full text-base md:text-lg'
          type='text'
          placeholder='@dhigh_eth'
          value={twitterUsername}
          onChange={e => setTwitterUsername(e.target.value)}
          onFocus={(e) => {
            if (!e.target.value) {
              setTwitterUsername('@');
            }
          }}
        />
        {twitterUsernameError && <p className="text-red-500 mt-2">{twitterUsernameError}</p>}

      </div>
      <div className='mt-10'>
        <h3 className='text-2xl md:text-3xl lg:text-4xl'>Wallet Address</h3>
        <input
          className='form-input w-full text-base md:text-lg'
          type='text'
          placeholder='0x000aed81...'
          value={walletAddress}
          onChange={e => setWalletAddress(e.target.value)}
        />
      </div>
      <div className='mt-10'>
        <h3 className='text-4xl'>Idea for new GIF</h3>
        <p className='text-sm md:text-base'>
          Submit your idea for a GIF below. Make sure to be as precise as possible and include any references/links to help us paint the picture.
          Also include the Penguin ID(s). Feel free to include relevant, popular keywords you think would fit.
          Example: &quot;Lil Pudgy #7944 jumping to high five Lil Pudgy #39. Like this GIF, but on a plain white background.&quot;
        </p>
        <textarea
          className='form-input w-full'
          placeholder='Your gif idea...'
          value={gifIdea}
          onChange={e => setGifIdea(e.target.value)} />
        {gifIdeaError && <p className="text-red-500 mt-2">{gifIdeaError}</p>}

      </div>
      <div className='my-10'>
        <h3 className='text-4xl'>Penguin #</h3>
        <p className='text-sm md:text-base'>
          Include one Penguin # you think would fit. If there&apos;s more than one penguin, mention all IDs and whether they&apos;re Lil Pudgys or Pudgy Penguins in the idea description box above.</p>
        <input
          className='form-input w-full'
          type='text'
          placeholder='Penguin ID reference'
          value={penguinID}
          onChange={e => setPenguinID(e.target.value)} />
        {penguinIDError && <p className="text-red-500 mt-2">{penguinIDError}</p>}

      </div>
      <button
        className='main-button w-full py-2 md:py-3 px-4 text-lg md:text-xl mb-10'
        onClick={handleSubmit}
      >
        Submit Idea
      </button>

    </div>
  )
}
