import { motion } from 'framer-motion';

export default function DisplayNotes({
  userNotes,
  generatedNotes,
  recallNoteType,
}: {
  userNotes: string;
  generatedNotes: string;
  recallNoteType: boolean;
}) {

  const containerStyle = recallNoteType ? 'space-y-2 mt-2 justify-center items-center overflow-auto h-[200px] md:h-[250px] xl:h-[400px]'
    : "p-4 overflow-auto h-[300px] xl:h-[400px]";
    
  return (
    <motion.div
      initial={{
        y: 15,
        opacity: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      className={containerStyle}
    >
      <h2 className="mt-2 text-blue-400">
        <b>Your notes:</b>
      </h2>
      <p className="whiteSpaces text-blue-300">
        {userNotes ? userNotes : "You have not inserted yor notes."}
      </p>
      <h2 className="mt-2 text-blue-400">
        <b>Generated notes:</b>
      </h2>
      <p className="whiteSpaces text-blue-300">{generatedNotes}</p>
    </motion.div>
  );
}
