import { Note as NoteModel } from "../models/note";
import { Card, CardBody, CardFooter, Flex, Heading, Text } from "@chakra-ui/react";
import { formatDate } from "../utils/formatDate";

interface NoteProps {
  note: NoteModel;
}

export default function Note({ note }: NoteProps) {
  const { title, text, createdAt, updatedAt } = note;

  let createdUpdatedText: string;
  if (updatedAt > createdAt) {
    createdUpdatedText = `Updated: ${formatDate(updatedAt)}`;
  } else {
    createdUpdatedText = `Created: ${formatDate(createdAt)}`;
  }

  return (
    <Card
      p={2}
      cursor="pointer"
      transition="box-shadow 0.3s"
      _hover={{
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      }}>
      <CardBody minH={40}>
        <Heading noOfLines={1} size="md" mb={2} textTransform="uppercase">
          {title}
        </Heading>
        <Text noOfLines={4}>{text}</Text>
      </CardBody>
      <CardFooter>
        <Flex alignItems="center" justify="space-between" w="full">
          <Text fontSize="sm" color="gray.500">
            {createdUpdatedText}
          </Text>
        </Flex>
      </CardFooter>
    </Card>
  );
}
