import Link from 'next/link';

export default function Page(){
    return (
        <div className="mt-10 m-5 sm:w-[650px] bg-blue-400 rounded-2xl border-2 border-blue-50 overflow-auto">
            <div className="flex justify-end bg-blue-500">
                <Link className="xBtn mr-4" href="/"><b>x</b></Link>
            </div>
            <div className='p-2'>
                <h2 className='title'>What does this app do?</h2>
                <p>
                    This app helps you actively recall words you would like to learn by following the forgetting curve, using spaced repetition technique.
                    More about it on <Link href='https://en.wikipedia.org/wiki/Spaced_repetition' target='blank' className="hover:underline"><b>spaced repetition wiki.</b></Link>
                </p>
                <h2 className='title'>How to use this app?</h2>
                <p>
                    This app allows you to review all the words you have learned, as well as the words you need to learn. There is a page called &quot;Recall&quot; for reviewing just crucial words for the right time.
                    You will get an email when it is time to recall some words based on the time that had passed. There is five rounds of repetition and each time you will grade how good you have remembered some word.
                    Repetitions will reset if you mark word as not recalled good enough, you will have a rating scale from 0 to 5. Not good enough is everything below the 3 so 0, 1 and 2.
                </p>
                <h3 className='title'>More information about the app can be found on each page&apos;s dedicated help link.</h3>
            </div>
        </div>
    )
}