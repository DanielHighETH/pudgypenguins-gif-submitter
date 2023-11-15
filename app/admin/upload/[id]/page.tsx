'use client'

import { useEffect, useState, ChangeEvent, DragEvent, KeyboardEvent } from "react"
import { useRouter } from "next/navigation"
import Loader from '@/app/components/Loader';
import OnlyAdmin from '@/app/components/OnlyAdmin';
import useAuthenticatedFetch from '@/app/lib/authenticatedFetch';
import Image from 'next/image'


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
}

function Upload({ params }: { params: { id: string } }) {
    const [gif, setGif] = useState<GifSubmission | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const [preview, setPreview] = useState<Preview | null>(null);
    const [tags, setTags] = useState<Tag[]>([]);
    const [inputValue, setInputValue] = useState('');


    const fetchWithAuth = useAuthenticatedFetch();


    const router = useRouter();

    useEffect(() => {
        fetchWithAuth(`/api/admin/getGifByID/${params.id}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                setGif(data.submission);
                setLoading(false);
            });
    }, [params.id, fetchWithAuth]);

    if (loading) {
        return <Loader />;
    }

    if (!gif) {
        return <div>No submission found.</div>;
    }

    function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
        //handle title change
    }

    function handleSourceChange(event: React.ChangeEvent<HTMLInputElement>) {
        //handle source change
    }

    function handleUpload(event: React.FormEvent<HTMLFormElement>) {
        //handle upload
    }

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) createPreview(file);
    };

    const handleFileDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        createPreview(file);
    };

    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const createPreview = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview({ src: reader.result as string, type: file.type });
        };
        reader.readAsDataURL(file);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (inputValue) {
                createTagsFromString(inputValue.trim());
                setInputValue('');
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
        if (inputValue) {
            createTagsFromString(inputValue.trim());
            setInputValue('');
        }
    };




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
                        {/* TODO: Change it from form to not form */}
                        <form onSubmit={handleUpload} className="upload-form space-y-6">
                            <div>
                                <h3 className='text-2xl md:text-3xl lg:text-4xl mt-5'>GIF Title</h3>
                                <input type="text" placeholder="Snow Ball Fight" onChange={handleTitleChange} required className="form-input w-full" />
                            </div>
                            <div className="flex flex-col">
                                <h3 className='text-2xl md:text-3xl lg:text-4xl mt-5'>GIF Tags</h3>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        placeholder="Pudgy Penguins, snow fight, snowball"
                                        onChange={handleInputChange}
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
                                <input type="url" placeholder="https://pudgypenguins.com/" onChange={handleSourceChange} defaultValue={"https://pudgypenguins.com/"} className="form-input w-full" />
                            </div>
                            <div>
                                <h3 className='text-2xl md:text-3xl lg:text-4xl'>Tweet text</h3>
                                <textarea rows={4} placeholder="https://pudgypenguins.com/" defaultValue={`New GIF just dropped! \n\nGif Idea by: @${gif.twitterUsername}`} className="form-input w-full" />
                            </div>
                            <div>
                                <h3 className='text-2xl md:text-3xl lg:text-4xl pt-5'>GIF Image</h3>
                                <div className="file-drop-area form-input rounded-lg p-6 transition-all flex justify-center items-center"
                                    onDragOver={handleDragOver}
                                    onDrop={handleFileDrop}>
                                    <input type="file"
                                        id="file-upload"
                                        onChange={handleFileChange}
                                        accept="image/gif,video/mp4,video/mov,video/webm"
                                        required
                                        hidden />
                                    <label htmlFor="file-upload" className="text-center text-oxford-blue font-kvant flex flex-col items-center justify-center">
                                        <Image
                                            src="/upload.png"
                                            width={75}
                                            height={75}
                                            alt="Upload icon"
                                        />
                                        <p className="mt-5">
                                            Drag and drop your gif here or <span className="text-sky-blue underline cursor-pointer">click to select the gif</span>
                                        </p>
                                    </label>
                                </div>
                                {preview && (
                                    <div className="preview flex justify-center mt-4">
                                        {preview.type.startsWith('image/') ? (
                                            <Image src={preview.src} alt="Preview" width={250} height={250} className="block" />
                                        ) : (
                                            <video src={preview.src} controls className="max-w-full h-auto" />
                                        )}
                                    </div>
                                )}
                            </div>
                            <div>
                                <button type="submit" className="main-button py-2 px-4 w-full">Upload</button>
                            </div>
                        </form>


                        {uploading && <Loader />} {/* Show loader when uploading */}
                        {uploadSuccess && <div>Upload Successful!</div>}
                        {uploadError && <div>Error: {uploadError}</div>}
                    </div>

                </>
            )}
        </div>
    )
}

export default OnlyAdmin(Upload);