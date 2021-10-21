import * as React from "react"
import MapView, {
  MapViewProps,
  Marker
} from "react-native-maps"
// import MapViewDirections from "react-native-maps-directions"
import { RN_GOOGLE_MAPS_IOS_API_KEY } from "@env"
import { images } from "../../theme"
import { Image, Platform, StyleSheet } from "react-native";
import { Layout } from "../../constants";

// react-native
import {
	View
} from "react-native";

interface MapProps {
  isRideOn: boolean
  userLat: number
  userLng: number
  driverLat: number
  driverLng: number
  rotateAngle: number
  isRideStarted: boolean
  userDestinationLat: number,
  userDestinationLng: number,
  forwardedRef?: (ref: any) => void
}

type Props = MapProps & MapViewProps

export class Map extends React.PureComponent<Props> {
  // mapView: MapView
  
  onMapDirectionsReady = result => {
    // console.tron.log(result)
    // console.tron.log("result")
    // console.tron.log("result")
    // console.tron.log("result")
    // console.tron.log(this.props)
    // this.mapView.fitToCoordinates(result.coordinates, {
    //   edgePadding: {
    //     right: Layout.window.width / 20,
    //     bottom: Layout.window.height / 20,
    //     left: Layout.window.width / 20,
    //     top: Layout.window.height / 20
    //   }
    // })
  }

  getInitialState = () => {
    return {
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
    };
  }

  onRegionChange = (region: any) => {
    this.setState({ region });
  }
   
  
  onMapDirectionsError = errorMessage => {
    // console.tron.error(errorMessage)
  }
  
  render() {
    const {
      style,
      initialRegion,
      onMapReady,
      isRideOn,
      userLat,
      userLng,
      driverLat,
      driverLng,
      rotateAngle,
      isRideStarted,
      userDestinationLat,
      userDestinationLng,
      forwardedRef,
      showsMyLocationButton = true,
	  customMapStyle
    } = this.props
    // const origin = {
    //   latitude: isRideStarted ? driverLat : userLat,
    //   longitude: isRideStarted ? driverLng : userLng
    // };
    // const destination = {
    //   latitude: isRideStarted ? userDestinationLat : driverLat,
    //   longitude: isRideStarted ? userDestinationLng : driverLng
    // };
    
    return (
		<MapView
			followsUserLocation
			provider={'google'}
			style={style}
			showsUserLocation
			customMapStyle={customMapStyle}
        	initialRegion={initialRegion}

		/>
    )
  }
}
