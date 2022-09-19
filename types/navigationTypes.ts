
export type TabNavigationParamList = {
    BooksNavigator:undefined
    Settings: undefined
    MyPageNavigator: undefined
    HomeNavigator: undefined
    Login: undefined
    BooksScreen: undefined
}

export type BookNavigatorParamList = {
    Books: undefined
    SelectedBookScreen: { 
        bookId: string,
        title: string,
        description: string,
        authors: string,
        thumbnail?: string, 
        averageRating: number,
        ratingsCount: number,
    }
    SelectedBookMoreScreen: { 
        title: string,
        description: string,
    }
    BookScreen: undefined
    WriteReviewScreen: {
        bookId: string,
        userId: number
    }
    AllReviewsScreen: {
        bookId: string
    }
    LoginScreen: undefined
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
    SelectedBookScreen: { 
        bookId: string,
        title: string,
        description: string,
        authors: string,
        thumbnail?: string, 
        averageRating: number,
        ratingsCount: number,
    }
    SelectedBookMoreScreen: { 
        title: string,
        description: string,
    }
    WriteReviewScreen: {
        bookId: string,
        userId: number
    }
    AllReviewsScreen: {
        bookId: string
    },
    BookScreen: undefined,
    SettingsScreen: undefined
    ChangePasswordScreen: undefined

}

export type HomeNavigatorParamList = {
    Home: undefined
    UpdateStatus: {
        bookId: string,
        userId: number
    }
    UpdateGoalScreen: {
        bookId: string,
        userId: number
    }
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
    WriteReviewScreen: {
        bookId: string,
        userId: number
    }
    AllReviewsScreen: {
        bookId: string
    }

}