import React from "react";

const OverviewTab = ({ test }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-b-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sl. No
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Test name
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Questions
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Duration(min)
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Marks
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {test.testResults.tests.map((testItem, index) => (
            <tr key={index}>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                {testItem.slNo}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                {testItem.testName}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                {testItem.questions}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                {testItem.duration}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                {testItem.marks}
              </td>
            </tr>
          ))}
          {/* Total Row */}
          <tr className="bg-gray-50 font-medium">
            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
              total
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
              {test.testResults.total.questions}
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
              {test.testResults.total.duration}
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
              {test.testResults.total.marks}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default OverviewTab;