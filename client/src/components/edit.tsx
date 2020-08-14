import React, { useState, useContext } from "react";
import endpoint from "../config";
import { api } from "../api";
import { StorageContext } from "./common/localStorageContext";
import {
  Button,
  Box,
  Heading,
  useColorMode,
  Textarea,
  Text,
  FormControl,
  IconButton,
  useToast,
  Link,
  Tooltip,
  Flex,
  Icon
} from "@chakra-ui/core";
import ReactJson from "react-json-view";
import { navigate, RouteComponentProps } from "@reach/router";

const handleUpdate = (items: any, setItems: any, jsondata: "", appid: number, toast: any, mockmeSessionKey: string) => {
  const url = `${endpoint.APP_URL}/app-update`;
  const body = {
    jsondata,
    callid: appid,
  };
  api(url, "POST", body, mockmeSessionKey).then((res: any) => {
    let { call, json } = res;
    setItems(
      {
        ...items,
        [call]: { ...items[call], json },
      }
    );
  });
  toast({
    position: "bottom-left",
    title: "Updated JSON",
    description: "JSON value has been updated",
    status: "success",
    duration: 2000,
    isClosable: true,
  });
  navigate("/manage");
};

const handleDelete = (items: any, setItems: any, appid: number, toast: any, mockmeSessionKey: string) => {
  const url = `${endpoint.APP_URL}/app-delete`;
  const body = {
    callid: appid,
  };
  api(url, "POST", body, mockmeSessionKey).then((res: any) => {
    let { call } = res;
    delete items[call];
    setItems({ ...items });
    toast({
      position: "bottom-left",
      title: "Deleted API",
      description: "API has been deleted successfully",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
    Object.keys(items).length > 0 ? navigate("/manage") : navigate("/");
  });
};

type Props = {
  appid: number;
};

export const Edit: RouteComponentProps & any = ({ appid }: Props) => {
  const [editMode, setEditMode] = useState(false);
  const { apiStore, mockmeSessionKey, setAPIStore } = useContext(StorageContext);

  const { colorMode } = useColorMode();
  const toast = useToast();
  const [jsondata, setJsonData] = useState(apiStore[appid]?.json || "");
  const httpStatus = apiStore[appid]?.httpStatus || "";
  function isJson(str: string) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  return apiStore[appid] ?
    <Box>
      < Box p={[4, 10]} >
        <Box
          p={[4, 10]}
          bg={`mode.${colorMode}.box`}
          w="100%"
          borderWidth={colorMode === "light" ? "1px" : 0}
          rounded="lg"
          alignContent="center"
          overflow="hidden"
        >
          <Heading mb={5} as="h1">
            <Text color={`mode.${colorMode}.text`} fontWeight="400">
              Edit JSON response of {appid}:
            </Text>
          </Heading>

          <form>
            <FormControl mb={4} as={Flex} alignItems="center">
              <Icon name="info" size="16px" color="green.400" mr={2} />
              <Text fontSize="16px" color={`mode.${colorMode}.text`} mr={2}>HTTP Status:</Text>
              <Text color={`mode.${colorMode}.text`} fontWeight={600} fontSize="16px">{httpStatus}</Text>
            </FormControl>
            <FormControl mb={4}>
              {editMode && isJson(jsondata) ? (
                <ReactJson
                  src={JSON.parse(jsondata)}
                  theme={colorMode === "light" ? "bright:inverted" : "bright"}
                  onEdit={({ updated_src }) =>
                    setJsonData(JSON.stringify(updated_src))
                  }
                  onDelete={({ updated_src }) =>
                    setJsonData(JSON.stringify(updated_src))
                  }
                  onAdd={({ updated_src }) =>
                    setJsonData(JSON.stringify(updated_src))
                  }
                ></ReactJson>
              ) : (
                  <Textarea
                    minHeight="400px"
                    onChange={(e: any) => setJsonData(e.target.value)}
                    value={
                      isJson(jsondata)
                        ? JSON.stringify(JSON.parse(jsondata), null, 2)
                        : jsondata
                    }
                    color={`mode.${colorMode}.text`}
                    whiteSpace="pre"
                  ></Textarea>
                )}
            </FormControl>{" "}
            <Text as="span" mr={3} color={`mode.${colorMode}.text`}>
              Edit in:
            </Text>
            <Tooltip
              aria-label="Mode"
              placement="bottom"
              hasArrow
              label={`Edit JSON in ${
                editMode && isJson(jsondata) ? "Normal" : "Tree"
                } Mode`}
            >
              <Button
                variantColor="teal"
                rightIcon="edit"
                onClick={() => setEditMode(!editMode)}
                mr={5}
              >
                {editMode ? "Normal" : "JSON Tree"} Mode
              </Button>
            </Tooltip>
            <Tooltip
              aria-label="Delete"
              placement="bottom"
              hasArrow
              label="Delete this mock"
            >
              <IconButton
                variantColor="red"
                aria-label="Call Segun"
                icon="delete"
                onClick={() => handleDelete(apiStore, setAPIStore, appid, toast, mockmeSessionKey)}
                mr={5}
              />
            </Tooltip>
            <Tooltip
              aria-label="Link"
              placement="bottom"
              hasArrow
              label="Link to JSON mock"
            >
              <Link
                href={`${endpoint.APP_URL}/app/${mockmeSessionKey}/${appid}`}
                isExternal
              >
                <IconButton
                  aria-label="Link"
                  icon="external-link"
                  variantColor="blue"
                  mr={5}
                />
              </Link>
            </Tooltip>
            <Button
              rightIcon="arrow-forward"
              mt={[4, 0]}
              variantColor="green"
              onClick={() => handleUpdate(apiStore, setAPIStore, jsondata, appid, toast, mockmeSessionKey)}
            >
              Update JSON
            </Button>
          </form>
        </Box>
      </Box >
    </Box >
    : null;
};