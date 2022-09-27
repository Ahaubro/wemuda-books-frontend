import DefaultView from "../../components/DefaultView"
import { StyleSheet, Text, View, Pressable, TouchableOpacity } from 'react-native'
import { useDispatch } from 'react-redux'
import { startSession } from '../../redux/slices/sessionSlice'


interface WelcomeScreenProps{navigation: any}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({navigation}) => {

    const dispatch = useDispatch();

    return (
        <View style={{height: '100%'}}>
            <DefaultView>
                
                <View style={{ flexDirection: 'column', justifyContent: 'center', alignContent: 'center', marginVertical: 250 }}>

                    <Text style={ styles.welcomeText }>Welcome</Text>


                    <TouchableOpacity activeOpacity={0.7} style={styles.buttonBlack} onPress={() => {
                        navigation.navigate("SignUp")
                    }}>
                        <Text style={styles.btnWhiteText}>Get started</Text>
                    </TouchableOpacity>


                    <View style={{paddingVertical: 10}}>
                        <TouchableOpacity activeOpacity={0.7} style={styles.welcomeLoginPressable} onPress={() => {
                            navigation.navigate("Login")
                        }}>
                            <Text style={styles.btnBlackText}>Log in</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ paddingVertical: 25 }}>
                        <TouchableOpacity activeOpacity={0.7} style={{}} onPress={() => {
                            dispatch(startSession({ id: 0, token: "guest" }))
                        }}>
                            <Text style={styles.btnBlackText}>Continue without login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </DefaultView>
        </View>)
}

const styles = StyleSheet.create({
    buttonBlack: {
        fontFamily: "GraphikMedium",
        textAlign: "center",
        backgroundColor: "black",
        borderRadius: 10,
        paddingVertical: 20,
    },
    welcomeLoginPressable: {
        fontFamily: "GraphikMedium",
        textAlign: "center",
        backgroundColor: "none",
        borderRadius: 10,
        borderColor: 'black',
        borderWidth: 1,
        paddingVertical: 20,
    },
    btnWhiteText:{
        color: 'white',
        fontSize: 14,
        textAlign: 'center',
        fontFamily: "GraphikMedium",
    },
    btnBlackText:{
        fontSize: 14,
        textAlign: 'center',
        fontFamily: "GraphikMedium",
    },
    welcomeText:{
        fontSize: 30, 
        textAlign: 'center', 
        paddingBottom: 80,
        fontFamily: "GraphikMedium",
    }
})

export default WelcomeScreen