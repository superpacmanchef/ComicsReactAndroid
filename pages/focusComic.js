import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { checkCollection, checkPullList } from "../apis/UserDatabaseApi";
import { ScrollView } from "react-native-gesture-handler";
import FocusForm from "../components/FocusComic/focusForm";
import { useAppSelector } from "../redux/hooks";
import { getPullListState } from "../redux/reducers/pullList";
import { getLogedState } from "../redux/reducers/logedIn";
import { getCollectionState } from "../redux/reducers/collection";
import { Dimensions } from "react-native";
import Image from "react-native-scalable-image";
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
  AccordionList,
} from "accordion-collapse-react-native";

const width = Dimensions.get("screen").width / 2;

const FocusComic = ({ route }) => {
  const { Comic, getPullHandler } = route.params;

  const loged = useAppSelector(getLogedState);
  const pull = useAppSelector(getPullListState);
  const collection = useAppSelector(getCollectionState);
  const [formType, updateFormType] = useState([]);
  const [isCollapsed, updateIsCollapse] = useState([0]);

  //updates FormType Array [1/3 ,2/4]
  //odd for yes to comics is in collection / pull
  //even for no to comics is in collection / pull
  const checkComic = async (pull) => {
    if (loged) {
      const pullRes = await checkPullList(Comic, pull);
      const collectionRes = await checkCollection(Comic, collection);
      updateFormType([collectionRes, pullRes]);
    } else {
      updateFormType([]);
    }
  };

  useEffect(() => {
    checkComic(pull);
  }, [Comic, pull, collection]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <>
        <Text
          style={{
            fontSize: 30,
            textTransform: "capitalize",
            textAlign: "center",
          }}
        >
          {Comic.title} {Comic.issue_number}
        </Text>
        <Text style={styles.title}>{Comic.publisher}</Text>

        <Image
          style={{ alignSelf: "center" }}
          source={{ uri: Comic.image }}
          width={width}
        />
        {formType.length > 0 ? (
          <View style={styles.focusForm}>
            <FocusForm
              focusType={formType[0]}
              comic={Comic}
              checkComic={checkComic}
              getPullHandler={getPullHandler}
            />
            <FocusForm
              focusType={formType[1]}
              comic={Comic}
              checkComic={checkComic}
              getPullHandler={getPullHandler}
            />
          </View>
        ) : null}

        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            marginHorizontal: 10,
            paddingBottom: 20,
          }}
        >
          <Collapse>
            <CollapseHeader>
              <View>
                <Text style={styles.title}>Description</Text>
              </View>
            </CollapseHeader>
            <CollapseBody>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 15,
                }}
              >
                {Comic.description}
              </Text>
            </CollapseBody>
          </Collapse>
          <Collapse>
            <CollapseHeader>
              <View>
                <Text style={styles.title}>Store Date</Text>
              </View>
            </CollapseHeader>
            <CollapseBody>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 15,
                }}
              >
                {Comic.release_date ? Comic.release_date : Comic.store_date}
              </Text>
            </CollapseBody>
          </Collapse>

          {Comic.diamond_id ? (
            <>
              <Collapse>
                <CollapseHeader>
                  <View>
                    <Text style={styles.title}>Diamond ID</Text>
                  </View>
                </CollapseHeader>
                <CollapseBody>
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 15,
                    }}
                  >
                    {Comic.diamond_id}
                  </Text>
                </CollapseBody>
              </Collapse>
            </>
          ) : null}
          {Comic.id ? (
            <>
              <Collapse>
                <CollapseHeader>
                  <View>
                    <Text style={styles.title}>Comic Vine ID</Text>
                  </View>
                </CollapseHeader>
                <CollapseBody>
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 15,
                    }}
                  >
                    {Comic.id}
                  </Text>
                </CollapseBody>
              </Collapse>
            </>
          ) : null}
          {Comic.name ? (
            <Collapse>
              <CollapseHeader>
                <View>
                  <Text style={styles.title}>Title</Text>
                </View>
              </CollapseHeader>
              <CollapseBody>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 15,
                  }}
                >
                  {Comic.name}
                </Text>
              </CollapseBody>
            </Collapse>
          ) : null}

          {Comic.creators ? (
            <>
              <Collapse>
                <CollapseHeader>
                  <View>
                    <Text style={styles.title}>Creators</Text>
                  </View>
                </CollapseHeader>
                <CollapseBody>
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 15,
                    }}
                  >
                    {Comic.creators}
                  </Text>
                </CollapseBody>
              </Collapse>
            </>
          ) : null}
          {Comic.price ? (
            <>
              <Collapse>
                <CollapseHeader>
                  <View>
                    <Text style={styles.title}>Price</Text>
                  </View>
                </CollapseHeader>
                <CollapseBody>
                  <Text
                    style={{
                      fontSize: 15,
                    }}
                  >
                    {Comic.price}
                  </Text>
                </CollapseBody>
              </Collapse>
            </>
          ) : null}
        </View>
      </>
    </ScrollView>
  );
};

export default FocusComic;
const styles = StyleSheet.create({
  tinyLogo: {
    width: width,
  },
  container: {
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  load: {
    alignSelf: "center",
  },
  focusForm: {
    flexDirection: "row",
    alignSelf: "center",
  },
  title: {
    fontSize: 25,
    textAlign: "center",
  },
});
