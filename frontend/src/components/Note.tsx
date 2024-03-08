import React from "react";
import { Note as NoteModel } from "../models/note";
import { Card, CardBody, CardFooter, Flex, Heading, IconButton, Text } from "@chakra-ui/react";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";

interface NoteProps {
  note: NoteModel;
}

export default function Note({ note }: NoteProps) {
  const { title, text, createdAt, updatedAt } = note;

  return (
    <Card p={2}>
      <CardBody>
        <Heading size="md" mb={2} textTransform="uppercase">
          {title}
        </Heading>
        <Text>{text}</Text>
      </CardBody>
      <CardFooter>
        <Flex alignItems="center" justify="space-between" w="full">
          <Text fontSize="sm" color="gray.500">
            {createdAt}
          </Text>
          <Flex gap={1}>
            <IconButton isRound aria-label="Edit note" icon={<FaRegEdit />} />
            <IconButton isRound aria-label="Delete note" icon={<FaRegTrashAlt />} />
          </Flex>
        </Flex>
      </CardFooter>
    </Card>
  );
}
