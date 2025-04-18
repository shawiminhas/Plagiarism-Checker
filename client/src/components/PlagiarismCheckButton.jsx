import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

/**
 * Description placeholder
 *
 * @function PlagiarismCheckButton
 * @param {boolean} props.checkingForPlagiarism - Indicates if the plagiarism check is in progress
 * @param {*} props.onClick - Function to call when the button is clicked
 * @returns {JSX.Element}
 */

export default function PlagiarismCheckButton({ checkingForPlagiarism, onClick }) {
	return (
		<button
			type="submit"
			onClick={onClick}
			disabled={checkingForPlagiarism}
			className={`px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition ${
				checkingForPlagiarism ? "cursor-not-allowed" : "cursor-pointer"
			}`}>
			{checkingForPlagiarism ? (
				<div className="flex items-center gap-2">
					<span>
						<Spin indicator={<LoadingOutlined spin style={{ color: "white" }} />} size="medium" />
					</span>
					<span>Checking for plagiarism</span>
				</div>
			) : (
				"Check for Plagiarism"
			)}
		</button>
	);
}
