import { RootState } from '../../redux/store'
import { useSelector, useDispatch } from 'react-redux'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { MyPageNavigatorParamList } from '../../types/navigationTypes'

type BookListScreenNavigationProps = StackNavigationProp<MyPageNavigatorParamList, 'BookList'>
type BookLstScreenRouteProps = RouteProp<MyPageNavigatorParamList, 'BookList'>

type Props = {
    navigation: BookListScreenNavigationProps
    route: BookLstScreenRouteProps
}

function BookListScreen({ navigation, route }: Props){
    const session = useSelector((state: RootState) => state.session)

    const {books} = route.params

    return (<>
    
    </>)
}

export default BookListScreen