import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Dimensions, Image, ScrollView} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {BaseUrl} from '../../utils/BaseUrl';
import LinearGradient from 'react-native-linear-gradient';
import {useGetAppUsersDataMutation} from '../../apiServices/appUsers/AppUsersApi';
import SelectUserBox from '../../components/molecules/SelectUserBox';
import { setAppUsers } from '../../../redux/slices/appUserSlice';
import { slug } from '../../utils/Slug';
import { setAppUserType, setAppUserName, setAppUserId, setUserData, setId} from '../../../redux/slices/appUserDataSlice';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {select_userListType} from '../../utils/UiTypes'


const SelectUser = ({navigation}) => {
  const [listUsers, setListUsers] = useState();
  const [showSplash, setShowSplash] = useState(true)
  const [
    getUsers,
    {
      data: getUsersData,
      error: getUsersError,
      isLoading: getUsersDataIsLoading,
      isError: getUsersDataIsError,
    },
  ] = useGetAppUsersDataMutation();
  const dispatch = useDispatch()

  useEffect(() => {
    getData()
    getUsers();
  }, []);
  useEffect(() => {
    if (getUsersData) {
      console.log("type of users",getUsersData?.body);
      dispatch(setAppUsers(getUsersData?.body))
      setListUsers(getUsersData?.body);
    } else if(getUsersError) {
      console.log("getUsersError",getUsersError);
    }
  }, [getUsersData, getUsersError]);

  
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('loginData');
      console.log("loginData",JSON.parse(jsonValue))
      if(jsonValue!=null)
      {
      saveUserDetails(JSON.parse(jsonValue))
      }
      
    } catch (e) {
      console.log("Error is reading loginData",e)
    }
  };
  const saveUserDetails = (data) => {

    try {
      console.log("Saving user details", data)
      dispatch(setAppUserId(data?.user_type_id))
      dispatch(setAppUserName(data?.name))
      dispatch(setAppUserType(data?.user_type))
      dispatch(setUserData(data))
      dispatch(setId(data?.id))
      handleNavigation()
    }
    catch (e) {
      console.log("error", e)
    }
    
  }   

  const handleNavigation=()=>{
    
    setTimeout(() => {
      setShowSplash(false)
    navigation.navigate('Dashboard')

    }, 5000);
  }
  const primaryThemeColor = useSelector(
    state => state.apptheme.primaryThemeColor,
  )
    ? useSelector(state => state.apptheme.primaryThemeColor)
    : '#FF9B00';
  const secondaryThemeColor = useSelector(
    state => state.apptheme.secondaryThemeColor,
  )
    ? useSelector(state => state.apptheme.secondaryThemeColor)
    : '#FFB533';
  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : '#FFB533';

  const icon = useSelector(state => state.apptheme.icon)
    ? useSelector(state => state.apptheme.icon)
    : require('../../../assets/images/demoIcon.png');

    const otpLogin = useSelector(state => state.apptheme.otpLogin)
    // console.log(useSelector(state => state.apptheme.otpLogin))
    const passwordLogin = useSelector(state => state.apptheme.passwordLogin)
    // console.log(useSelector(state => state.apptheme.passwordLogin))
    const manualApproval = useSelector(state => state.appusers.manualApproval)
    const autoApproval = useSelector(state => state.appusers.autoApproval)
    const registrationRequired = useSelector(state => state.appusers.registrationRequired)
    console.log("registration required",registrationRequired)

  const width = Dimensions.get('window').width;
    
  

  return (
    <LinearGradient
      colors={["white", "white"]}
      style={styles.container}>
         <ScrollView showsVerticalScrollIndicator={false} style={{}}>
      <View
        style={{
          height: 140,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        
          <Image
            style={{
              height: 150,
              width: 270,
              resizeMode: 'contain',
              top: 60,
            }}
            source={{uri: `${icon}`}}></Image>

            <View style={{width:'80%',alignItems:"center",justifyContent:'center',borderColor:ternaryThemeColor,borderTopWidth:1,borderBottomWidth:1,height:40,marginTop:40}}>
              <PoppinsTextMedium style={{color:'#171717',fontSize:20,fontWeight:'700'}} content="Choose your profile "></PoppinsTextMedium>
            </View>
        {/* </View> */}
      </View>
     
       
        <View style={styles.userListContainer}>
          {listUsers &&
            listUsers.map((item, index) => {
              return (
                <SelectUserBox
                style={{}}
                  navigation = {navigation}
                  otpLogin={otpLogin}
                  passwordLogin={passwordLogin}
                  autoApproval={autoApproval}
                  manualApproval={manualApproval}
                  registrationRequired={registrationRequired}
                  key={index}
                  color={ternaryThemeColor}
                  image={item.user_type_logo}
                  content={item.user_type}
                  userListType = {select_userListType}
                  id={item.user_type_id}></SelectUserBox>
              );
            })}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height:'100%',
    width: '100%',
    alignItems: 'center'
  },
  semicircle: {
    backgroundColor: 'white',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  banner: {
    height: 184,
    width: '90%',
    borderRadius: 10,
  },
  userListContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:100,
    
  },
});

export default SelectUser;
