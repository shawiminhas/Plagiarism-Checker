export default function DownloadReportButton({ plagiarismBlob }) {
	function handleDownload() {
		try {
			const url = window.URL.createObjectURL(plagiarismBlob);

			const a = document.createElement("a");
			a.href = url;
			a.download = "plagiarism_report.pdf";
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);

			window.URL.revokeObjectURL(url);
		} catch (e) {
			console.error("Error downloading the report:", e);
		}
	}

	return (
		<div>
			<button
				type="button"
				className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
				onClick={handleDownload}>
				Download Plagiarism Report
			</button>
		</div>
	);
}
