import Link from 'next/link';

export default function Page(){
    return (
        <div className="mt-60 w-[650px] h-[560px]d bg-blue-400 rounded-2xl border-2 border-blue-50 overflow-auto">
            <div className="flex justify-end bg-blue-500">
                <Link className="xBtn mr-4" href="/"><b>x</b></Link>
            </div>
            <div>
                <h2 className='title'>What does this app do?</h2>
                <p>
                    This app should help you actively recall words you would like to learn by following the forgetting curve, technique spaced repetition.
                    More about it on <Link href='https://en.wikipedia.org/wiki/Spaced_repetition' target='blank' className="hover:underline"><b>spaced repetition wiki.</b></Link>
                </p>
                <h2 className='title'>How to use this app?</h2>
                <p>
                    This app alows you to review all the words you have learned, also all the words you need to learn and there is a page called recall for reviewing just crucial words for particular time.
                You will get an email when it is time to recall some words based on the time that had passed. There is 5 rounds of repeating and each time you will grade how good you have remembered some word.
                Repetitions will reset if you mark word as not recalled good enough, you will have range 1-5. Not good enough is everything below the 3, so 1 and 2.
                </p>
                <h3 className='title'>More informations on the app are on every help link.</h3>
            </div>
        </div>
    )
}