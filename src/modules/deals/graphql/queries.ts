const commonParams = `
  $customerIds: [String],
  $companyIds: [String],
  $assignedUserIds: [String],
  $nextDay: String,
  $nextWeek: String,
  $nextMonth: String,
  $noCloseDate: String,
  $overdue: String,
  $productIds: [String]
`;

const commonParamDefs = `
  customerIds: $customerIds,
  companyIds: $companyIds,
  assignedUserIds: $assignedUserIds,
  nextDay: $nextDay,
  nextWeek: $nextWeek,
  nextMonth: $nextMonth,
  noCloseDate: $noCloseDate,
  overdue: $overdue,
  productIds: $productIds
`;

const dealFields = `
  _id
  name
  stageId
  hasNotified
  pipeline {
    _id
    name
  }
  boardId
  companies {
    _id
    primaryName
    website
  }
  customers {
    _id
    firstName
    primaryEmail
    primaryPhone
  }
  products
  productsData
  amount
  closeDate
  description
  assignedUsers {
    _id
    email
    details {
      fullName
      avatar
    }
  }
  stage {
    probability
    name
  }
  isWatched
  attachments {
    name
    url
    type
    size
  }
  modifiedAt
  modifiedBy
`;

const dealsTotalAmounts = `
  query dealsTotalAmounts(
    $date: ItemDate
    $pipelineId: String
    ${commonParams}
  ) {
    dealsTotalAmounts(
      date: $date
      pipelineId: $pipelineId
      ${commonParamDefs}
    ) {
      _id
      dealCount
      totalForType {
        _id
        name
        currencies {
          name
          amount
        }
      }
    }
  }
`;

const deals = `
  query deals(
    $initialStageId: String,
    $pipelineId: String,
    $stageId: String,
    $date: ItemDate,
    $skip: Int,
    $search: String
    ${commonParams}
  ) {
    deals(
      pipelineId: $pipelineId,
      initialStageId: $initialStageId,
      stageId: $stageId,
      date: $date,
      skip: $skip,
      search: $search
      ${commonParamDefs}
    ) {
      ${dealFields}
    }
  }
`;

const dealDetail = `
  query dealDetail($_id: String!) {
    dealDetail(_id: $_id) {
      ${dealFields}
    }
  }
`;

const productDetail = `
  query productDetail($_id: String!) {
    productDetail(_id: $_id) {
      _id
      name
    }
  }
`;

export default {
  deals,
  dealDetail,
  productDetail,
  dealsTotalAmounts
};
