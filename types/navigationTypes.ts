
export type TabNavigationParamList = {
    BooksNavigator:undefined
    Settings: undefined
    MyPage: undefined
    Home: undefined
    Login: undefined
}

export type BookNavigatorParamList = {
    Books: undefined
    SelectedBookScreen: { 
        bookId: string,
        title: string,
        description: string,
        author: string,
        thumbnail?: string, 
        averageRating: number,
        ratingsCount: number,
    }
    SelectedBookMoreScreen: { 
        title: string,
        description: string,
    }
    BookScreen: undefined
}

type Book = {
    bookId: string,
    title: string,
    description: string,
    author: string,
    thumbnail?: string, 
    averageRating: number,
    ratingsCount: number
}

export type MyPageNavigatorParamList = {
    MyPage: undefined
    BookList: {
        title: string,
        books: Book[]
    }
}

export type HomeNavigatorParamList = {
    Home: undefined
    UpdateStatus: {
        bookId: string,
        userId: number
    }
}