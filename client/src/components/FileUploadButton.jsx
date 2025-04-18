/**
 * FileUploadButton Component
 *
 * @param {string} props.selectedFileName - The name of the selected file
 * @param {e: React.ChangeEvent<HTMLInputElement> => void} props.handleFileChange - Callback function to handle file change
 * @returns {JSX.Element} - The rendered file upload button component
 */
export default function FileUploadButton({ selectedFileName, handleFileChange }) {
	return (
		<label
			className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition cursor-pointer flex items-center justify-center"
			htmlFor="file-upload">
			{selectedFileName || "Choose File"}
			<input id="file-upload" className="hidden" type="file" onChange={handleFileChange} />
		</label>
	);
}
