// export const MessageContent = ({
//   type,
//   text,
//   mediaUrl,
// }: {
//   type: string;
//   text?: string;
//   mediaUrl?: string;
// }) => {
//   return (
//     <>
//       {/* Media */}
//       {mediaUrl && type === "image" && (
//         <img
//           src={mediaUrl}
//           alt="image"
//           style={{
//             maxWidth: "220px",
//             maxHeight: "220px",
//             borderRadius: "8px",
//             display: "block",
//           }}
//         />
//       )}

//       {mediaUrl && type === "audio" && (
//         <audio
//           src={mediaUrl}
//           controls
//         />
//       )}

//       {mediaUrl && type === "video" && (
//         <video
//           src={mediaUrl}
//           controls
//           style={{ maxWidth: "220px" }}
//         />
//       )}

//       {mediaUrl && type === "file" && (
//         <a
//           href={mediaUrl}
//           target="_blank"
//           rel="noreferrer"
//         >
//           📄 Download file
//         </a>
//       )}
//       {mediaUrl && type === "application/pdf" && (
//   <a href={mediaUrl} target="_blank" rel="noreferrer">
//     📄 Open PDF
//   </a>
// )}

//       {/* Text */}
//       {text && (
//         <span>
//           {text}
//         </span>
//       )}
//     </>
//   );
// };


import {
  FiFile,
  FiFileText,
  FiImage,
  FiMusic,
  FiVideo,
  FiDownload,
} from "react-icons/fi";
import {
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
  FaFileArchive,
} from "react-icons/fa";

interface MessageContentProps {
  type?: string;
  text?: string;
  mediaUrl?: string;
}

export const MessageContent = ({
  type,
  text,
  mediaUrl,
}: MessageContentProps) => {
  const isImage = type?.startsWith("image/");
  const isAudio = type?.startsWith("audio/");
  const isVideo = type?.startsWith("video/");

  const getFileInfo = () => {
    if (type === "application/pdf") {
      return {
        icon: <FaFilePdf size={28} />,
        name: "PDF Document",
      };
    }

    if (
      type === "application/msword" ||
      type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return {
        icon: <FaFileWord size={28} />,
        name: "Word Document",
      };
    }

    if (
      type === "application/vnd.ms-excel" ||
      type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      return {
        icon: <FaFileExcel size={28} />,
        name: "Excel Spreadsheet",
      };
    }

    if (
      type === "application/vnd.ms-powerpoint" ||
      type ===
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ) {
      return {
        icon: <FaFilePowerpoint size={28} />,
        name: "PowerPoint Presentation",
      };
    }

    if (
      type === "application/zip" ||
      type === "application/x-rar-compressed"
    ) {
      return {
        icon: <FaFileArchive size={28} />,
        name: "Archive File",
      };
    }

    if (type === "text/plain") {
      return {
        icon: <FiFileText size={28} />,
        name: "Text File",
      };
    }

    return {
      icon: <FiFile size={28} />,
      name: "File",
    };
  };

  return (
    <div>
      {/* Image */}
      {mediaUrl && isImage && (
        <img
          src={mediaUrl}
          alt="image"
          style={{
            maxWidth: "100px",
            maxHeight: "100px",
            borderRadius: "10px",
            display: "block",
            objectFit: "cover",
          }}
        />
      )}

      {/* Audio */}
      {mediaUrl && isAudio && (
        <div style={styles.audioContainer}>
          <FiMusic size={24} />

          <audio
            src={mediaUrl}
            controls
            style={{ maxWidth: "220px" }}
          />
        </div>
      )}

      {/* Video */}
      {mediaUrl && isVideo && (
        <video
          src={mediaUrl}
          controls
          style={{
            maxWidth: "300px",
            maxHeight: "250px",
            borderRadius: "10px",
            display: "block",
          }}
        />
      )}

      {/* Files */}
      {mediaUrl && !isImage && !isAudio && !isVideo && (
        <a
          href={mediaUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={styles.fileCard}
        >
          <div style={styles.fileIcon}>
            {getFileInfo().icon}
          </div>

          <div style={styles.fileInfo}>
            <strong>{getFileInfo().name}</strong>

            <span>Click to open</span>
          </div>

          <FiDownload size={20} />
        </a>
      )}

      {/* Message text */}
      {text && (
        <div style={styles.messageText}>
          {text}
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  fileCard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px",
    minWidth: "220px",
    borderRadius: "10px",
    textDecoration: "none",
    background: "var(--code-bg)",
    color: "var(--text-h)",
    cursor: "pointer",
  },

  fileIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--accent-bg)",
    color: "var(--accent)",
    flexShrink: 0,
  },

  fileInfo: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    gap: "3px",
    overflow: "hidden",
  },

  audioContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  messageText: {
    marginTop: "8px",
    wordBreak: "break-word",
  },
};

export default MessageContent;