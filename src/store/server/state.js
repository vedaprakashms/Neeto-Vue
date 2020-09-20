export default function () {
  return {
    kbGuid: '',
    kbServer: '',
    lang: '',
    email: '',
    displayName: '',
    userGuid: '',
    isLogin: false,
    currentNotes: [], // current notes summary information,
    currentNote: {}, // current note which will be rendered on vditor,
    isCurrentNoteLoading: false, // current notes list loading state,
    isCurrentNotesLoading: false, // current notes loading state,
    categories: [],
    currentCategory: '',
    uploadImageUrl: ''
  }
}
