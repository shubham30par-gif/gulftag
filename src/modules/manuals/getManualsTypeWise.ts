// import { ManualsModel } from "./schema";
// type condition = {
//   type?: string;
// };
// export const getManualsTypeWise = async (condition: condition) => {
//   const data = await ManualsModel.aggregate([
//     {
//       $match: condition,
//     },
//     {
//       $group: {
//         _id: {
//           type: "$type",
//           subCategory: "$subCategory",
//           title: "$title",
//         },
//         manuals: { $push: "$$ROOT" },
//       },
//     },
//     {
//       $group: {
//         _id: {
//           type: "$_id.type",
//           subCategory: "$_id.subCategory",
//         },
//         titleWise: {
//           $push: {
//             title: "$_id.title",
//             manuals: "$manuals",
//           },
//         },
//       },
//     },
//     {
//       $group: {
//         _id: "$_id.type",
//         subCategoryWise: {
//           $push: {
//             subCategory: "$_id.subCategory",
//             titleWise: "$titleWise",
//           },
//         },
//       },
//     },
//     {
//       $project: {
//         _id: 0,
//         type: "$_id",
//         subCategoryWise: 1,
//       },
//     },
//   ]);

//   return data;
// };

import { ManualsModel } from "./schema";

type condition = {
  type?: string;
  subCategory?: string;
  language?: string;
};

export const getManualsTypeWise = async (condition: condition) => {
  const pipeline: any[] = [
    { $match: condition },
    // Filter for English manuals in "General user manuals" subcategory
    {
      $match: {
        $or: [
          { subCategory: { $ne: "General user manuals" } },
          { subCategory: "General user manuals" },
        ],
      },
    },
    // Sort by order field for "General user manuals" (nulls last)
    {
      $sort: {
        order: 1,
        _id: 1, // Secondary sort to ensure consistency
      },
    },
    {
      $group: {
        _id: {
          type: "$type",
          subCategory: "$subCategory",
          title: "$title",
        },
        manuals: { $push: "$$ROOT" },
      },
    },
    {
      $group: {
        _id: {
          type: "$_id.type",
          subCategory: "$_id.subCategory",
        },
        titleWise: {
          $push: {
            title: "$_id.title",
            manuals: "$manuals",
            // Include order from the first manual (if exists)
            order: { $first: "$manuals.order" },
          },
        },
      },
    },
    // Sort titleWise by order (nulls last)
    {
      $addFields: {
        titleWise: {
          $sortArray: {
            input: "$titleWise",
            sortBy: { order: 1, title: 1 }, // Sort by order, then title
          },
        },
      },
    },
    {
      $group: {
        _id: "$_id.type",
        subCategoryWise: {
          $push: {
            subCategory: "$_id.subCategory",
            titleWise: "$titleWise",
          },
        },
      },
    },
    // Sort subCategoryWise by subCategory
    {
      $addFields: {
        subCategoryWise: {
          $sortArray: {
            input: "$subCategoryWise",
            sortBy: { subCategory: 1 },
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        type: "$_id",
        subCategoryWise: 1,
      },
    },
  ];

  const data = await ManualsModel.aggregate(pipeline);
  return data;
};
