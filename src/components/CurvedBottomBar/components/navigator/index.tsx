/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import { Dimensions, SafeAreaView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { getPath, getPathUp } from './path';
const { width: w } = Dimensions.get('window');
import Androw from 'react-native-androw';

export interface Props {
  type?: 'CURVE_DOWN' | 'CURVE_UP';
  style?: StyleProp<ViewStyle>;
  width?: number;
  height?: number;
  borderTopLeftRight?: boolean;
  circleWidth?: number;
  bgColor?: string;
  initialRouteName: string;
  renderCircle: () => JSX.Element;
  tabBar: ({
             routeName,
             selectTab,
             navigation,
           }: {
    routeName: string;
    selectTab: string;
    navigation: (selectTab: string) => void;
  }) => React.ReactNode;
}

const defaultProps = {
  bgColor: 'gray',
  type: 'CURVE_DOWN',
  borderTopLeftRight: false,
};

const BottomBarComponent: React.FC<Props> = (props) => {
  const {
    type,
    style,
    width = w,
    height = 65,
    circleWidth = 60,
    bgColor,
    initialRouteName,
    tabBar,
    renderCircle,
    borderTopLeftRight
  } = props;
  const [selectMenuItem, setSelectMenuItem] = useState(null);
  const [selectTab, setSelectTab] = useState<string>(initialRouteName);
  const [itemLeft, setItemLeft] = useState([]);
  const [itemRight, setItemRight] = useState([]);

  const _renderButtonCenter = () => {
    return renderCircle();
  };

  useEffect(() => {
    const children = props?.children as any[];
    const arrLeft: any = children.filter((item) => item.props.position === 'left');
    const arrRight: any = children.filter((item) => item.props.position === 'right');

    setItemLeft(arrLeft);
    setItemRight(arrRight);

    setRouteName(initialRouteName);
  }, []);

  const setRouteName = (name: string) => {
    setSelectTab(name);
    const children = props?.children as any[];
    const route = children.filter((item) => item.props.name === name);
    if (route.length > 0) {
      setSelectMenuItem(route[0].props.component);
    } else {
      setSelectMenuItem(children[0].props.component);
    }
  };

  const d = type === 'CURVE_DOWN' ? getPath(width, height, circleWidth >= 60 ? circleWidth : 60, borderTopLeftRight) : getPathUp(width, height + 30, circleWidth >= 60 ? circleWidth : 60, borderTopLeftRight);
  if (d) {
    return (
        <SafeAreaView style={[styles.wrapContainer, { backgroundColor: bgColor }]}>
          <View style={styles.wrapContainer}>
            {selectMenuItem ? <View style={{ flex: 1, backgroundColor: 'white' }}>{selectMenuItem}</View> : null}
            <View style={[styles.container, style]}>
              <Androw style={styles.shadow}>
                <Svg width={width} height={height + (type === 'CURVE_DOWN' ? 0 : 30)}>
                  <Path fill={bgColor} {...{ d }} />
                </Svg>
              </Androw>
              <View style={[styles.main, { width: width }, type === 'CURVE_UP' && { top: 30 }]}>
                <View style={[styles.rowLeft, { height: height }]}>
                  {itemLeft.map((item: any, index) => {
                    const routeName: string = item.props.name;

                    return (
                        <View style={{ flex: 1 }} key={index}>
                          {tabBar({
                            routeName,
                            selectTab: selectTab,
                            navigation: (selectTab: string) => {
                              setRouteName(selectTab);
                            },
                          })}
                        </View>
                    );
                  })}
                </View>
                {_renderButtonCenter()}
                <View style={[styles.rowRight, { height: height }]}>
                  {itemRight.map((item: any, index) => {
                    const routeName = item.props.name;
                    return (
                        <View style={{ flex: 1 }} key={index}>
                          {tabBar({
                            routeName,
                            selectTab: selectTab,
                            navigation: (selectTab: string) => {
                              setRouteName(selectTab);
                            },
                          })}
                        </View>
                    );
                  })}
                </View>
              </View>
            </View>
          </View>
        </SafeAreaView>
    );
  }
  return null;
};

BottomBarComponent.defaultProps = defaultProps;

export default BottomBarComponent;

const styles = StyleSheet.create({
  wrapContainer: {
    flex: 1,
  },
  container: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center'
  },
  main: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowLeft: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shadow:{
    shadowColor: '#000000',
    shadowOffset:{
      width: 0,
      height: -2,
    },
    shadowOpacity:.05,
    shadowRadius: 10
  }
});
