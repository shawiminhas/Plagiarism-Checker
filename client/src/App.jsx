import "./App.css";
import "@ant-design/v5-patch-for-react-19";
import Header from "./components/Header";
import InputForm from "./components/InputForm";

function App() {
	return (
		<div className="flex flex-col items-center">
			<Header />
			<InputForm />
		</div>
	);
}

export default App;
