'use client'

import { useEffect, useState, ChangeEvent, DragEvent, KeyboardEvent } from "react"
import { useRouter } from "next/navigation"
import Loader from '@/app/components/Loader';
import OnlyAdmin from '@/app/components/OnlyAdmin';
import useAuthenticatedFetch from '@/app/lib/authenticatedFetch';
import Image from 'next/image'
import { useAlert } from '@/app/components/UseAlert';


type GifSubmission = {
    twitterUsername: string;
    userWallet: string;
    gifIdea: string;
    penguinID: string;
    status: string;
};

type Tag = string;

interface Preview {
    src: string;
    type: string;
    file: File | null;
}

function Upload({ params }: { params: { id: string } }) {
    //gif submission
    const [gif, setGif] = useState<GifSubmission | null>(null);

    //loading
    const [loading, setLoading] = useState(true);

    // form data
    // const [title, setTitle] = useState<string>('');
    const [tagValue, setTagValue] = useState<string>('');
    const [tags, setTags] = useState<Tag[]>([]);
    const [urlSource, setUrlSource] = useState<string>('https://pudgypenguins.com/');

    // file upload urls
    const [gifUrl, setGifUrl] = useState<string>('');
    const [stickerUrl, setStickerUrl] = useState<string>('');


    //preview
    const [gifPreview, setGifPreview] = useState<Preview>({ src: '', type: '', file: null });
    const [stickerPreview, setStickerPreview] = useState<Preview>({ src: '', type: '', file: null });
    const [isStickerSelected, setIsStickerSelected] = useState(false);

    // uploading statuses
    const [uploading, setUploading] = useState(false);

    // tweet text

    const randomTweetArray = [
        "New GIF just dropped! \n\nGif Idea by: @",
        "Checkout the new GIF! \n\nGif Idea by: @",
        "New GIF alert! \n\nGif Idea by: @",
        "Banger GIF just dropped! \n\nGif Idea by: @",
        "Fresh GIF from the oven! \n\nGif Idea by: @",
    ]

    const getRandomTweet = () => {
        const randomIndex = Math.floor(Math.random() * randomTweetArray.length);
        return randomTweetArray[randomIndex];
    }

    const [tweetText, setTweetText] = useState(getRandomTweet());

    const fetchWithAuth = useAuthenticatedFetch();

    const router = useRouter();

    //alert
    const { showMessage } = useAlert();

    useEffect(() => {
        fetchWithAuth(`/api/admin/getGifByID/${params.id}`)
            .then((response) => response.json())
            .then((data) => {
                setGif(data.submission);
                setTweetText(prevTweetText => `${prevTweetText}${data.submission.twitterUsername}`)
                setLoading(false);
            });
    }, [params.id, fetchWithAuth]);


    if (loading) {
        return <Loader />;
    }

    if (!gif) {
        return <div>No submission found.</div>;
    }

    //TAGS
    const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (tagValue) {
                createTagsFromString(tagValue.trim());
                setTagValue('');
            }
        }
    };

    const createTagsFromString = (input: string) => {
        const newTags = input.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        setTags([...tags, ...newTags]);
    };

    const handleDeleteTag = (tagToDelete: Tag) => {
        setTags(tags.filter(tag => tag !== tagToDelete));
    };

    const handleAddClick = () => {
        if (tagValue) {
            createTagsFromString(tagValue.trim());
            setTagValue('');
        }
    };

    //FILE

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>, isSticker: boolean = false) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) processFile(file, isSticker);
    };

    const handleFileDrop = (event: DragEvent<HTMLDivElement>, isSticker: boolean = false) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        processFile(file, isSticker);
    };

    const handleStickerToggle = () => {
        setIsStickerSelected(!isStickerSelected);
    };

    const processFile = async (file: File, isSticker: boolean) => {
        const mimeType = file.type;
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Data = reader.result as string;
            const result = { src: base64Data, type: mimeType, file };
            isSticker ? setStickerPreview(result) : setGifPreview(result);
        };

        reader.onload = async () => {
            if (reader.result) {
                const uri = reader.result as string;
                const base64String = uri.split(',')[1];

                const body = {
                    fileName: file.name,
                    mimeType,
                    fileContent: base64String,
                    id: params.id,
                }

                const uploadToDrive = await fetchWithAuth(`/api/admin/uploadToDrive`, {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                const data = await uploadToDrive.json();
                if (isSticker) {
                    setStickerUrl(data.details.webContentLink);
                } else {
                    setGifUrl(data.details.webContentLink);
                }
            }
        };
        // Start by reading the file as a data URL (base64)
        reader.readAsDataURL(file);
    };



    async function handleUpload(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!tags.length || !urlSource) {
            showMessage('Please fill out TAGS and URL Source fields');
            return;
        }

        if (!gifUrl || (isStickerSelected && !stickerUrl) || (isStickerSelected && !gifUrl)) {
            showMessage('Please wait until the GIF is uploaded and try again')
            return;
        }
        setUploading(true);
        const commaTags = tags.join(',');

        const body = {
            //title,
            tags: commaTags,
            source_post_url: urlSource,
            file: gifUrl,
            sticker: stickerUrl,
            tweetText,
        }

        try {
            await fetchWithAuth(`/api/admin/uploadGif/${params.id}`, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    setUploading(false)
                    showMessage("Gif uploaded successfully!")
                    router.push(`/uploaded/${params.id}`);
                });
        } catch (error) {
            console.error(error)
            setUploading(false);
        }
    }




    return (
        <div className='mx-4 md:mx-10 lg:mx-72'>
            <h1 className='text-3xl md:text-4xl lg:text-5xl mt-10 mb-10'>
                Upload a Gif
            </h1>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <div className='bg-white shadow-lg rounded-lg p-6'>
                        <p className="mb-4">
                            <strong>Twitter: </strong><a href={`https://twitter.com/${gif.twitterUsername}`} target='_blank' rel='noopener noreferrer' className="text-sky-blue hover:text-oxford-blue">
                                @{gif.twitterUsername}
                            </a>
                        </p>
                        <p className='mb-4'><strong>Idea for new GIF:</strong> {gif.gifIdea}</p>
                        <p className='mb-4'><strong>Penguin #:</strong> {gif.penguinID}</p>
                        <p className='mb-4'><strong>Wallet Address:</strong> {gif.userWallet}</p>
                        <p className='mb-4'><strong>Status:</strong> {gif.status}</p>
                    </div>

                    <div className='bg-white shadow-lg rounded-lg p-6 mt-10'>
                        <form onSubmit={handleUpload} className="upload-form space-y-6">
                            {/* <div>
                                <h3 className='text-2xl md:text-3xl lg:text-4xl mt-5'>GIF Title</h3>
                                <input
                                    type="text"
                                    placeholder="Snow Ball Fight"
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    className="form-input w-full"
                                />
                            </div> */}
                            <div>
                                <h3 className='text-2xl md:text-3xl lg:text-4xl pt-5'>Gif & Sticker Upload</h3>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" onChange={handleStickerToggle} className="form-checkbox" />
                                    <span>Add a Sticker to Your GIF</span>
                                </label>
                            </div>

                            <div className="flex gap-4 mt-4">
                                <div className={`file-drop-area form-input rounded-lg p-6 transition-all flex justify-center items-center ${isStickerSelected ? 'w-1/2' : 'w-full'}`}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={handleFileDrop}>
                                    <input type="file"
                                        id="gif-upload"
                                        onChange={handleFileChange}
                                        accept="image/gif,video/mp4,video/mov,video/webm"
                                        name="gif"
                                        hidden />
                                    <label htmlFor="gif-upload" className="text-center text-oxford-blue font-kvant flex flex-col items-center justify-center">
                                        <Image
                                            src="/upload.png"
                                            width={75}
                                            height={75}
                                            alt="Upload GIF icon"
                                        />
                                        <p className="mt-5">
                                            Drag and drop your <strong>GIF</strong> here or <span className="text-sky-blue underline cursor-pointer">click to select the GIF</span>
                                        </p>
                                    </label>
                                </div>
                                {isStickerSelected && (
                                    <div className="file-drop-area form-input rounded-lg p-6 transition-all flex justify-center items-center w-1/2"
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={(e) => handleFileDrop(e, true)}>
                                        <input type="file"
                                            id="sticker-upload"
                                            onChange={(e) => handleFileChange(e, true)}
                                            accept="image/gif,video/mp4,video/mov,video/webm"
                                            name="sticker"
                                            hidden />
                                        <label htmlFor="sticker-upload" className="text-center text-oxford-blue font-kvant flex flex-col items-center justify-center">
                                            <Image
                                                src="/upload.png"
                                                width={75}
                                                height={75}
                                                alt="Upload Sticker icon"
                                            />
                                            <p className="mt-5">
                                                Drag and drop your <strong>Sticker</strong> here or <span className="text-sky-blue underline cursor-pointer">click to select the Sticker</span>
                                            </p>
                                        </label>
                                    </div>
                                )}
                            </div>
                            <div className="flex w-full">
                                <div className={`${isStickerSelected ? 'w-1/2' : 'w-full'}`}>
                                    {(gifPreview && gifPreview.src) && (
                                        <div className="preview flex justify-center mt-4">
                                            {gifPreview.type.startsWith('image/') ? (
                                                <Image src={gifPreview.src} alt="Preview" width={250} height={250} className="block main-button" />
                                            ) : (
                                                <video src={gifPreview.src} controls className="max-w-full h-auto" />
                                            )}
                                        </div>
                                    )}
                                </div>
                                {(stickerPreview && stickerPreview.src && isStickerSelected) && (
                                    <div className="w-1/2">
                                        <div className="preview flex justify-center mt-4">
                                            {stickerPreview.type.startsWith('image/') ? (
                                                <Image src={stickerPreview.src} alt="Sticker Preview" width={250} height={250} className="block main-button" />
                                            ) : (
                                                <video src={stickerPreview.src} controls className="max-w-full h-auto" />
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <h3 className='text-2xl md:text-3xl lg:text-4xl mt-5'>GIF Tags</h3>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={tagValue}
                                        placeholder="Pudgy Penguins, snow fight, snowball"
                                        onChange={(e) => setTagValue(e.target.value)}
                                        onKeyDown={handleInputKeyDown}
                                        className="form-input w-full"
                                    />
                                    <button type="button" onClick={handleAddClick} className="form-input">+</button>
                                </div>
                                <div className="flex flex-wrap gap-2 p-2 mt-5">
                                    {tags.map((tag, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => handleDeleteTag(tag)}
                                            className="flex items-center gap-1 px-4 py-2 rounded tag-button cursor-pointer"
                                        >
                                            #{tag} <span className="text-sm">✖</span>
                                        </button>
                                    ))}

                                </div>
                            </div>
                            <div>
                                <h3 className='text-2xl md:text-3xl lg:text-4xl'>Source URL</h3>
                                <input type="url"
                                    placeholder="https://pudgypenguins.com/"
                                    onChange={(e) => setUrlSource(e.target.value)}
                                    defaultValue={urlSource}
                                    className="form-input w-full" />
                            </div>
                            <div>
                                <h3 className='text-2xl md:text-3xl lg:text-4xl'>Tweet text</h3>
                                <textarea
                                    rows={4}
                                    placeholder="https://pudgypenguins.com/"
                                    defaultValue={`${tweetText}`}
                                    onChange={(e) => setTweetText(e.target.value)}
                                    className="form-input w-full" />
                            </div>

                            <div>
                                {uploading ? (
                                    <Loader />
                                ) : (
                                    <button
                                        type="submit"
                                        className="main-button py-2 px-4 w-full"
                                        // disabled={!gifUrl || (isStickerSelected && !stickerUrl) || (isStickerSelected && !gifUrl)}
                                    >
                                        Upload
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </>
            )}
        </div>
    )
}

export default OnlyAdmin(Upload);