
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
}