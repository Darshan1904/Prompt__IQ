import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar.component"
import UserAuthForm from "./pages/userAuthForm.page";
import UserState from "./context/User/userState";
import EditorState from "./context/User/editorState";
import Editor from "./pages/editor.pages";
import HomePage from "./pages/home.page";
import SearchPage from "./pages/search.page";
import PageNotFound from "./pages/404.page";
import ProfilePage from "./pages/profile.page";
import PromptPage from "./pages/prompt.page";
import PromptState from "./context/User/promptState";

const App = () => {
    return (
        <UserState>
            <PromptState>
                <EditorState>
                    <Routes>
                        <Route path="/editor" element={<Editor />} />
                        <Route path="/editor/:promptId" element={<Editor />} />
                        <Route path="/" element={<Navbar />}>
                            <Route index element={<HomePage />} />
                            <Route path="signin" element={<UserAuthForm type="Sign In" />} />
                            <Route path="signup" element={<UserAuthForm type="Sign Up" />} />
                            <Route path="search/:query" element={<SearchPage />} />
                            <Route path="user/:id" element={<ProfilePage />} />
                            <Route path="prompts/:promptId" element={<PromptPage />} />
                            <Route path="*" element={<PageNotFound />} />
                        </Route>
                    </Routes>
                </EditorState>
            </PromptState>
        </UserState>                                                   
    )
}
export default App;